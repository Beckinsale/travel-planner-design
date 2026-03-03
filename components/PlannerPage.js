function PlannerPage({
  onBack,
  onChatWithAI,
  onTourSelect,
  onSave,
  editingRoute,
}) {
  const [activeTab, setActiveTab] = React.useState('my');
  const [selectedFilter, setSelectedFilter] = React.useState('Все');
  const mapRef = React.useRef(null);
  const [searchInput, setSearchInput] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [plannedBudget, setPlannedBudget] = React.useState(
    editingRoute ? editingRoute.budget : 0,
  );
  const searchContainerRef = React.useRef(null);
  const [editingPointId, setEditingPointId] = React.useState(null);
  const [editingTitle, setEditingTitle] = React.useState('');
  const [isActiveRoute, setIsActiveRoute] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.addEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeletePoint = (id) => {
    setRoutePoints((prev) => prev.filter((point) => point.id !== id));
  };

  const handleEditPoint = (id, currentTitle) => {
    setEditingPointId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveEdit = (id) => {
    const titleToSave = editingTitle;
    setRoutePoints((prev) =>
      prev.map((point) =>
        point.id === id
          ? { ...point, title: titleToSave || point.title }
          : point,
      ),
    );
    setEditingPointId(null);

    // При сохранении имени предлагаем обновить координаты
    if (titleToSave && window.ymaps) {
      window.ymaps.ready(() => {
        window.ymaps.geocode(titleToSave).then((res) => {
          const firstGeoObject = res.geoObjects.get(0);
          if (firstGeoObject) {
            const coords = firstGeoObject.geometry.getCoordinates();
            setRoutePoints((prev) =>
              prev.map((p) => (p.id === id ? { ...p, coords: coords } : p)),
            );
          }
        });
      });
    }
  };

  // Добавим стейт для точек с бюджетом
  const [routePoints, setRoutePoints] = React.useState(
    editingRoute ? editingRoute.points : [],
  );

  const totalBudget = React.useMemo(
    () => routePoints.reduce((sum, p) => sum + p.budget, 0),
    [routePoints],
  );

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchInput(val);

    if (val.length > 2) {
      // Тестовые данные для отображения выпадающего списка
      setSearchResults([
        { displayName: `${val} - Центр`, value: `${val} - Центр` },
        { displayName: `${val} - Отель Плаза`, value: `${val} - Отель Плаза` },
        { displayName: `${val} - Аэропорт`, value: `${val} - Аэропорт` },
      ]);
      setShowOptions(true);
    } else {
      setSearchResults([]);
      setShowOptions(false);
    }
  };

  const handleAddLocation = (item) => {
    // В API 2.1 suggest возвращает объекты с полями { value, displayName, hl }
    const title =
      typeof item === 'string' ? item : item.value || item.displayName;
    if (!title || !title.trim()) return;

    setIsSearching(true);
    setShowOptions(false);

    if (window.ymaps) {
      window.ymaps.ready(() => {
        // Выполняем геокодирование для получения точных координат
        window.ymaps
          .geocode(title)
          .then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            const coords = firstGeoObject
              ? firstGeoObject.geometry.getCoordinates()
              : [55.751574, 37.573856];

            const newPoint = {
              id: Date.now(),
              title: title,
              coords: coords,
              budget: 0,
              date: new Date().toISOString().split('T')[0],
            };

            setRoutePoints((prev) => [...prev, newPoint]);
            setSearchInput('');
            setIsSearching(false);
          })
          .catch(() => {
            const randomOffsetLat = (Math.random() - 0.5) * 0.1;
            const randomOffsetLon = (Math.random() - 0.5) * 0.1;
            const newPoint = {
              id: Date.now(),
              title: title,
              coords: [
                55.751574 + randomOffsetLat,
                37.573856 + randomOffsetLon,
              ],
              budget: 0,
            };
            setRoutePoints((prev) => [...prev, newPoint]);
            setSearchInput('');
            setIsSearching(false);
          });
      });
    } else {
      // Фоллбек
      const randomOffsetLat = (Math.random() - 0.5) * 0.1;
      const randomOffsetLon = (Math.random() - 0.5) * 0.1;
      const newPoint = {
        id: Date.now(),
        title: title,
        coords: [55.751574 + randomOffsetLat, 37.573856 + randomOffsetLon],
        budget: 0,
        date: new Date().toISOString().split('T')[0],
      };
      setRoutePoints((prev) => [...prev, newPoint]);
      setSearchInput('');
      setIsSearching(false);
    }
  };

  const ymapsMapRef = React.useRef(null);
  const polylineRef = React.useRef(null);
  const placemarksRef = React.useRef([]);

  React.useEffect(() => {
    if (activeTab === 'my' && window.ymaps) {
      window.ymaps.ready(() => {
        if (!mapRef.current) return;

        // Если карта уже инициализирована, только обновляем данные
        if (ymapsMapRef.current) {
          const map = ymapsMapRef.current;

          // Обновляем линию
          if (polylineRef.current) {
            polylineRef.current.geometry.setCoordinates(
              routePoints.map((p) => p.coords),
            );
          }

          // Обновляем метки
          routePoints.forEach((point, index) => {
            const placemark = placemarksRef.current[index];
            if (placemark) {
              // Если метка существует, обновляем ее свойства
              if (
                !placemark.geometry
                  .getCoordinates()
                  .every((val, i) => val === point.coords[i])
              ) {
                placemark.geometry.setCoordinates(point.coords);
              }
              placemark.properties.set({
                iconContent: String(index + 1),
                iconCaption:
                  point.budget > 0 ? `${point.budget} ₽` : 'Бесплатно',
                balloonContentHeader: point.title,
                balloonContentBody: `Запланированный бюджет: <b>${point.budget} ₽</b>`,
              });
            } else {
              // Если метки нет (добавлена новая точка), создаем ее
              const newPlacemark = new window.ymaps.Placemark(
                point.coords,
                {
                  iconContent: String(index + 1),
                  iconCaption:
                    point.budget > 0 ? `${point.budget} ₽` : 'Бесплатно',
                  balloonContentHeader: point.title,
                  balloonContentBody: `Запланированный бюджет: <b>${point.budget} ₽</b>`,
                },
                {
                  preset: 'islands#blueIcon',
                  draggable: true,
                },
              );

              newPlacemark.events.add('drag', () => {
                const newCoords = newPlacemark.geometry.getCoordinates();
                if (polylineRef.current) {
                  const polyCoords =
                    polylineRef.current.geometry.getCoordinates();
                  polyCoords[index] = newCoords;
                  polylineRef.current.geometry.setCoordinates(polyCoords);
                }
              });

              newPlacemark.events.add('dragend', () => {
                const newCoords = newPlacemark.geometry.getCoordinates();
                setRoutePoints((prev) => {
                  const newPoints = [...prev];
                  newPoints[index].coords = newCoords;
                  return newPoints;
                });
              });

              map.geoObjects.add(newPlacemark);
              placemarksRef.current.push(newPlacemark);
            }
          });

          // Удаляем лишние метки, если точки были удалены
          while (placemarksRef.current.length > routePoints.length) {
            const removedPlacemark = placemarksRef.current.pop();
            map.geoObjects.remove(removedPlacemark);
          }

          return;
        }

        // Инициализация карты (выполняется только один раз)
        mapRef.current.innerHTML = '';

        const map = new window.ymaps.Map(mapRef.current, {
          center:
            routePoints.length > 0
              ? routePoints[0].coords
              : [55.751574, 37.573856],
          zoom: 11,
          controls: ['zoomControl'],
        });

        ymapsMapRef.current = map;

        const polyline = new window.ymaps.Polyline(
          routePoints.map((p) => p.coords),
          {},
          {
            strokeColor: '#0ea5e9',
            strokeWidth: 4,
            strokeStyle: 'shortdash',
          },
        );
        map.geoObjects.add(polyline);
        polylineRef.current = polyline;
        placemarksRef.current = [];

        routePoints.forEach((point, index) => {
          const placemark = new window.ymaps.Placemark(
            point.coords,
            {
              iconContent: String(index + 1),
              iconCaption: point.budget > 0 ? `${point.budget} ₽` : 'Бесплатно',
              balloonContentHeader: point.title,
              balloonContentBody: `Запланированный бюджет: <b>${point.budget} ₽</b>`,
            },
            {
              preset: 'islands#blueIcon',
              draggable: true,
            },
          );

          placemark.events.add('drag', () => {
            const newCoords = placemark.geometry.getCoordinates();
            if (polylineRef.current) {
              const polyCoords = polylineRef.current.geometry.getCoordinates();
              polyCoords[index] = newCoords;
              polylineRef.current.geometry.setCoordinates(polyCoords);
            }
          });

          placemark.events.add('dragend', () => {
            const newCoords = placemark.geometry.getCoordinates();
            setRoutePoints((prev) => {
              const newPoints = [...prev];
              newPoints[index].coords = newCoords;
              return newPoints;
            });
          });

          map.geoObjects.add(placemark);
          placemarksRef.current.push(placemark);
        });

        if (routePoints.length > 0) {
          map.setBounds(map.geoObjects.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 40,
          });
        }
      });
    }

    // Очистка при размонтировании или смене вкладки
    return () => {
      if (activeTab !== 'my' && ymapsMapRef.current) {
        ymapsMapRef.current.destroy();
        ymapsMapRef.current = null;
        polylineRef.current = null;
        placemarksRef.current = [];
      }
    };
  }, [activeTab, routePoints]);

  const categories = [
    { id: 'city', label: 'Город', icon: 'MapPin' },
    { id: 'hotel', label: 'Отель', icon: 'Hotel' },
    { id: 'food', label: 'Еда', icon: 'Utensils' },
    { id: 'museum', label: 'Места', icon: 'Landmark' },
    { id: 'transport', label: 'Транспорт', icon: 'Plane' },
  ];

  const PREDEFINED_ROUTES_DATA = {
    Байкал: [
      {
        id: 1,
        title: 'Ледяная сказка Байкала',
        desc: 'Погрузитесь в мир чистого льда и зимних приключений на озере Байкал.',
        total: '65 000 ₽',
        img: 'https://images.pexels.com/photos/9344421/pexels-photo-9344421.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['❄️ Зима', 'РФ'],
        routeCount: '3.1к',
        temp: '-15°',
        weatherIcon: 'Cloud',
        points: [
          {
            id: 1,
            title: 'Листвянка',
            coords: [51.8687, 104.8943],
            budget: 5000,
            date: '2026-02-01',
            image:
              'https://images.pexels.com/photos/9344421/pexels-photo-9344421.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
          {
            id: 2,
            title: 'Ольхон',
            coords: [53.0784, 107.4103],
            budget: 10000,
            date: '2026-02-03',
            image:
              'https://images.pexels.com/photos/11832049/pexels-photo-11832049.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
          {
            id: 3,
            title: 'Бухта Песчаная',
            coords: [52.3382, 105.7196],
            budget: 2000,
            date: '2026-02-02',
            image:
              'https://images.pexels.com/photos/13593452/pexels-photo-13593452.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
        ],
        budget: 17000,
      },
      {
        id: 2,
        title: 'Летний Байкал: Природа и Отдых',
        desc: 'Идеальный маршрут для знакомства с летней красотой Байкала, его природой и культурой.',
        total: '70 000 ₽',
        img: 'https://images.pexels.com/photos/10103738/pexels-photo-10103738.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['☀️ Лето', 'РФ'],
        routeCount: '2.5к',
        temp: '+20°',
        weatherIcon: 'Sun',
        points: [
          {
            id: 1,
            title: 'Иркутск',
            coords: [52.2868, 104.2818],
            budget: 8000,
            date: '2026-07-10',
            image:
              'https://images.pexels.com/photos/10103738/pexels-photo-10103738.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
          {
            id: 2,
            title: 'Остров Ольхон',
            coords: [53.0784, 107.4103],
            budget: 12000,
            date: '2026-07-12',
            image:
              'https://images.pexels.com/photos/20120286/pexels-photo-20120286.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
          {
            id: 3,
            title: 'Аршан',
            coords: [51.9161, 102.4336],
            budget: 5000,
            date: '2026-07-15',
            image:
              'https://images.pexels.com/photos/10103723/pexels-photo-10103723.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
        ],
        budget: 25000,
      },
    ],
    Алтай: [
      {
        id: 3,
        title: 'Алтай: Золотые Горы',
        desc: 'Дикая природа, бирюзовая Катунь и бескрайние степи.',
        total: '55 000 ₽',
        img: 'https://images.pexels.com/photos/10103738/pexels-photo-10103738.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['⚡ Активный', 'РФ'],
        routeCount: '2.8к',
        temp: '+8°',
        weatherIcon: 'Sun',
        points: [
          {
            id: 1,
            title: 'Горно-Алтайск',
            coords: [51.9562, 85.9616],
            budget: 7000,
            date: '2026-08-01',
            image:
              'https://images.pexels.com/photos/10103738/pexels-photo-10103738.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
          {
            id: 2,
            title: 'Телецкое озеро',
            coords: [51.7456, 87.2023],
            budget: 9000,
            date: '2026-08-03',
            image:
              'https://images.pexels.com/photos/20120286/pexels-photo-20120286.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
          {
            id: 3,
            title: 'Чуйский тракт',
            coords: [50.315, 86.82],
            budget: 3000,
            date: '2026-08-05',
            image:
              'https://images.pexels.com/photos/10103720/pexels-photo-10103720.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
        ],
        budget: 19000,
      },
    ],
    Камчатка: [
      {
        id: 4,
        title: 'Камчатка: Вулканы и Океан',
        desc: 'Путешествие на край света к огнедышащим горам и Тихому океану.',
        total: '115 000 ₽',
        img: 'https://images.pexels.com/photos/20120288/pexels-photo-20120288.jpeg?auto=compress&cs=tinysrgb&w=800',
        tags: ['⛰️ Экстрим', 'РФ'],
        routeCount: '1.5к',
        temp: '+5°',
        weatherIcon: 'Wind',
        points: [
          {
            id: 1,
            title: 'Петропавловск-Камчатский',
            coords: [53.0452, 158.6483],
            budget: 15000,
            date: '2026-09-01',
            image:
              'https://images.pexels.com/photos/20120288/pexels-photo-20120288.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
          {
            id: 2,
            title: 'Вулкан Мутновский',
            coords: [52.45, 157.6833],
            budget: 20000,
            date: '2026-09-03',
            image:
              'https://images.pexels.com/photos/13593453/pexels-photo-13593453.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
          {
            id: 3,
            title: 'Долина гейзеров',
            coords: [54.45, 160.0],
            budget: 25000,
            date: '2026-09-05',
            image:
              'https://images.pexels.com/photos/13593456/pexels-photo-13593456.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
        ],
        budget: 60000,
      },
    ],
    Сочи: [
      {
        id: 5,
        title: 'Сочи: Горы и Море',
        desc: 'Идеальный баланс: 2 дня в горах, 3 дня на побережье.',
        total: '45 000 ₽',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
        tags: ['⚡ Активный', 'РФ'],
        routeCount: '1.2к',
        temp: '+12°',
        weatherIcon: 'CloudSun',
        points: [
          {
            id: 1,
            title: 'Красная Поляна',
            coords: [43.6826, 40.2337],
            budget: 8000,
            date: '2026-06-01',
            image:
              'https://images.unsplash.com/photo-1515861461225-1488dfdaf0a8?q=80&w=2070&auto=format&fit=crop',
          },
          {
            id: 2,
            title: 'Олимпийский парк',
            coords: [43.4, 39.95],
            budget: 4000,
            date: '2026-06-02',
            image:
              'https://images.unsplash.com/photo-1540339832862-47452993c66e?q=80&w=2070&auto=format&fit=crop',
          },
          {
            id: 3,
            title: 'Дендрарий Сочи',
            coords: [43.5683, 39.7303],
            budget: 2000,
            date: '2026-06-03',
            image:
              'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070&auto=format&fit=crop',
          },
        ],
        budget: 14000,
      },
    ],
  };

  return (
    <div className="bg-white min-h-screen w-full max-w-full flex flex-col">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 w-full flex-1 flex flex-col">
        {/* Шапка с табами */}
        <div className="mb-8 bg-white md:p-0 rounded-none w-full">
          <h2 className="text-2xl md:text-4xl font-black text-brand-indigo tracking-tight mb-6 text-left">
            Маршруты
          </h2>

          <div className="flex p-1 bg-slate-50 rounded-xl w-full max-w-md md:mx-0">
            <button
              onClick={() => setActiveTab('my')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'my' ? 'bg-white text-brand-indigo shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Конструктор
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'popular' ? 'bg-white text-brand-indigo shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Популярные
            </button>
          </div>
        </div>

        {activeTab === 'my' ? (
          /* КОНСТРУКТОР МАРШРУТА */
          <div className="animate-in fade-in duration-500">
            <div className="mb-10 w-full">
              <div
                ref={searchContainerRef}
                className="flex flex-col md:flex-row gap-4 w-full relative items-center"
              >
                <div className="w-full relative group flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-sky transition-colors">
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Icon name="Search" size={20} />
                    )}
                  </div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchInput}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleAddLocation(searchInput)
                    }
                    placeholder="Поиск места..."
                    className="w-full pl-12 pr-4 py-4 md:py-5 bg-slate-50 rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-brand-sky/20 outline-none text-slate-800 font-bold text-base md:text-lg transition-all placeholder:text-slate-400 shadow-sm"
                  />
                </div>

                <button
                  onClick={() => handleAddLocation(searchInput)}
                  disabled={isSearching}
                  className="w-full md:w-auto px-8 py-4 md:py-5 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-sm md:text-base shadow-xl shadow-[#f59e0b]/30 active:scale-95 transition-all whitespace-nowrap disabled:opacity-70"
                >
                  ДОБАВИТЬ
                </button>

                {/* Всплывающие варианты Яндекс Карт + AI */}
                {showOptions && searchInput.length > 2 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col">
                      {searchResults.length > 0 ? (
                        searchResults.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAddLocation(item)}
                            className="flex items-center gap-3 w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
                          >
                            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-brand-sky/10 flex items-center justify-center text-slate-400 group-hover:text-brand-sky transition-colors shrink-0">
                              <Icon name="MapPin" size={14} />
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden">
                              <span className="font-bold text-slate-700 group-hover:text-brand-indigo truncate">
                                {item.displayName || item.value}
                              </span>
                            </div>
                            <Icon
                              name="Plus"
                              size={14}
                              className="ml-auto text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            />
                          </button>
                        ))
                      ) : (
                        <div className="px-5 py-4 text-slate-500 text-sm font-medium text-center">
                          Ищем варианты...
                        </div>
                      )}
                      <button
                        onClick={() => onChatWithAI?.(searchInput)}
                        className="flex items-center gap-3 w-full text-left px-5 py-5 bg-slate-50 hover:bg-slate-100 transition-colors group mt-2 border-t border-slate-100"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                          <Icon name="MessageSquare" size={22} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-brand-indigo uppercase tracking-wider text-xs">
                            Найти с AI
                          </span>
                          <span className="text-slate-500 text-sm font-medium">
                            AI найдет место: «{searchInput}»
                          </span>
                        </div>
                        <Icon
                          name="ArrowRight"
                          size={18}
                          className="ml-auto text-brand-indigo transition-transform group-hover:translate-x-1"
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full aspect-[4/5] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden relative border border-slate-200 shadow-inner bg-slate-50 group">
              <div ref={mapRef} className="w-full h-full"></div>
            </div>

            {/* РАСПРЕДЕЛЕНИЕ БЮДЖЕТА */}
            <div className="mb-10 mt-10 w-full bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-brand-indigo uppercase tracking-widest">
                    Бюджет маршрута
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-slate-400 uppercase tracking-widest text-xs md:text-sm">
                    Планируемый:
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      value={plannedBudget}
                      onChange={(e) =>
                        setPlannedBudget(Number(e.target.value) || 0)
                      }
                      className="w-24 md:w-32 px-3 py-2 bg-white border border-slate-200 rounded-xl text-right font-bold text-brand-indigo focus:ring-2 focus:ring-brand-sky/20 outline-none transition-all pr-7 text-sm md:text-base"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none text-sm">
                      ₽
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {routePoints.map((point, i) => (
                  <div
                    key={point.id}
                    className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 group bg-slate-50 p-4 md:p-4 rounded-2xl border border-transparent hover:border-slate-200 transition-all shadow-sm hover:shadow-md relative"
                  >
                    <button
                      onClick={() => handleDeletePoint(point.id)}
                      className="md:hidden absolute top-3 right-3 p-2 text-slate-300 hover:text-red-500 transition-colors z-10"
                    >
                      <Icon name="Plus" size={18} className="rotate-45" />
                    </button>
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-8 md:pr-0">
                      <div className="w-5 h-5 md:w-6 md:h-6 shrink-0 rounded-full bg-brand-sky text-white font-bold flex items-center justify-center text-[10px] shadow-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingPointId === point.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              autoFocus
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onBlur={() => handleSaveEdit(point.id)}
                              onKeyDown={(e) =>
                                e.key === 'Enter' && handleSaveEdit(point.id)
                              }
                              className="w-full bg-white border border-brand-sky rounded-lg px-2 py-1 font-bold text-slate-700 text-sm outline-none"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700 text-sm md:text-base truncate">
                              {point.title}
                            </span>
                            <button
                              onClick={() =>
                                handleEditPoint(point.id, point.title)
                              }
                              className="p-1 text-slate-300 hover:text-brand-sky transition-all shrink-0"
                              title="Переименовать и обновить место"
                            >
                              <Icon name="Pencil" size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto justify-start">
                      <div className="relative w-full md:w-44">
                        <input
                          type="date"
                          value={point.date || ''}
                          onChange={(e) => {
                            const newPoints = [...routePoints];
                            newPoints[i].date = e.target.value;
                            setRoutePoints(newPoints);
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-500 focus:ring-2 focus:ring-brand-sky/20 outline-none transition-all text-sm md:text-base"
                        />
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-44">
                          <input
                            type="number"
                            min="0"
                            value={point.budget}
                            onChange={(e) => {
                              const newPoints = [...routePoints];
                              newPoints[i].budget = Math.max(
                                0,
                                Number(e.target.value) || 0,
                              );
                              setRoutePoints(newPoints);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === '-' || e.key === 'e')
                                e.preventDefault();
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-right font-bold text-brand-indigo focus:ring-2 focus:ring-brand-sky/20 outline-none transition-all pr-7 text-sm md:text-base"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none text-sm">
                            ₽
                          </span>
                        </div>
                        {/* Кнопка удаления для десктопа */}
                        <button
                          onClick={() => handleDeletePoint(point.id)}
                          className="hidden md:flex p-2 text-slate-300 hover:text-red-500 transition-colors shrink-0"
                          title="Удалить точку"
                        >
                          <Icon name="Plus" size={18} className="rotate-45" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4 pt-6 border-t border-slate-200/60 flex flex-col gap-6">
                  <div className="flex items-center justify-between px-2">
                    <span className="font-black text-slate-400 uppercase tracking-widest text-xs md:text-sm">
                      Итого по точкам
                    </span>
                    <span
                      className={`font-black ${totalBudget > plannedBudget && plannedBudget > 0 ? 'text-red-500' : totalBudget <= plannedBudget && plannedBudget > 0 ? 'text-emerald-500' : 'text-brand-amber'} text-xl md:text-3xl drop-shadow-sm`}
                    >
                      {totalBudget.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isActiveRoute}
                          onChange={(e) => setIsActiveRoute(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-sky"></div>
                      </div>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-brand-indigo transition-colors">
                        Сделать активным маршрутом
                      </span>
                    </label>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                      <button
                        onClick={() =>
                          onChatWithAI?.({
                            points: routePoints,
                            budget: plannedBudget,
                          })
                        }
                        className="w-full md:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                      >
                        РЕДАКТИРОВАТЬ С AI
                      </button>
                      <button
                        onClick={() =>
                          onSave?.({
                            points: routePoints,
                            budget: totalBudget,
                            isActive: isActiveRoute,
                          })
                        }
                        className="w-full md:w-auto px-8 py-4 bg-brand-indigo text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-lg shadow-brand-indigo/20 hover:brightness-90 active:scale-95 transition-all"
                      >
                        СОХРАНИТЬ МАРШРУТ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* СПИСОК ПОПУЛЯРНЫХ МАРШРУТОВ */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-full mb-10">
              <div className="relative group mb-8">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-sky transition-colors">
                  <Icon name="MapPin" size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Куда"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-brand-sky/20 outline-none text-slate-800 font-bold text-base md:text-lg transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex gap-2 overflow-x-auto no-scrollbar md:overflow-visible md:flex-nowrap pb-2">
                  {['Все', 'Активный', 'Зима', 'Экстрим'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFilter(f)}
                      className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 active:scale-95 select-none outline-none border-2 ${
                        selectedFilter === f
                          ? 'bg-brand-sky text-white border-brand-sky shadow-lg shadow-brand-sky/15'
                          : 'bg-white text-slate-500 border-slate-100 hover:border-brand-sky/30 hover:text-brand-indigo hover:bg-slate-50'
                      }`}
                    >
                      {f === 'Активный' && <span className="text-sm">⚡</span>}
                      {f === 'Зима' && <span className="text-sm">❄️</span>}
                      {f === 'Экстрим' && <span className="text-sm">⛰️</span>}
                      {f}
                    </button>
                  ))}
                  <div className="w-12 shrink-0 md:hidden"></div>
                </div>
                <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none md:hidden z-10"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 md:gap-12 pb-10">
              {Object.entries(PREDEFINED_ROUTES_DATA)
                .flatMap(([direction, routes]) => routes)
                .filter(
                  (route) =>
                    selectedFilter === 'Все' ||
                    route.tags.some((tag) =>
                      tag.includes(selectedFilter),
                    ),
                )
                .map((route) => (
                  <div
                    key={route.id}
                    onClick={() => {
                      console.log('PlannerPage: Selected route:', route);
                      onTourSelect(route);
                    }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] md:aspect-[16/10] rounded-[3rem] overflow-hidden mb-6 shadow-2xl isolation-auto">
                      <img
                        src={route.img}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 rounded-[3rem] will-change-transform"
                        alt={route.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-[3rem]"></div>
                      <div className="absolute top-6 left-6">
                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg">
                          <Icon name={route.weatherIcon} size={14} />{' '}
                          {route.temp}
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 text-left">
                        <h3 className="text-2xl md:text-4xl font-black text-white mb-1 tracking-tight leading-none drop-shadow-2xl">
                          {route.title}
                        </h3>
                        <div className="flex items-center gap-2 text-white/90 font-bold text-xs uppercase tracking-widest mb-4 drop-shadow-lg"></div>
                        <div className="bg-brand-amber text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest inline-block shadow-xl">
                          {route.total}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed px-4 text-left">
                      {route.desc}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
