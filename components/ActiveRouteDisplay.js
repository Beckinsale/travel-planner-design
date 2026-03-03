function ActiveRouteDisplay({ activeRoute, onEditRoute }) {
  const mapRef = React.useRef(null);
  const ymapsMapRef = React.useRef(null);
  const polylineRef = React.useRef(null);
  const placemarksRef = React.useRef([]);

  React.useEffect(() => {
    if (activeRoute && window.ymaps) {
      window.ymaps.ready(() => {
        if (!mapRef.current) return;

        // Если карта уже инициализирована, только обновляем данные
        if (ymapsMapRef.current) {
          const map = ymapsMapRef.current;

          // Обновляем линию
          if (polylineRef.current) {
            polylineRef.current.geometry.setCoordinates(
              activeRoute.points.map((p) => p.coords),
            );
          }

          // Обновляем метки
          activeRoute.points.forEach((point, index) => {
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
                  draggable: false,
                },
              );

              map.geoObjects.add(newPlacemark);
              placemarksRef.current.push(newPlacemark);
            }
          });

          // Удаляем лишние метки, если точки были удалены
          while (placemarksRef.current.length > activeRoute.points.length) {
            const removedPlacemark = placemarksRef.current.pop();
            map.geoObjects.remove(removedPlacemark);
          }
           if (activeRoute.points.length > 0) {
              map.setBounds(map.geoObjects.getBounds(), {
                checkZoomRange: true,
                zoomMargin: 40,
              });
            }

          return;
        }

        // Инициализация карты (выполняется только один раз)
        mapRef.current.innerHTML = '';

        const map = new window.ymaps.Map(mapRef.current, {
          center:
            activeRoute.points.length > 0
              ? activeRoute.points[0].coords
              : [55.751574, 37.573856],
          zoom: 11,
          controls: ['zoomControl'],
        });

        ymapsMapRef.current = map;

        const polyline = new window.ymaps.Polyline(
          activeRoute.points.map((p) => p.coords),
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

        activeRoute.points.forEach((point, index) => {
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
              draggable: false,
            },
          );

          map.geoObjects.add(placemark);
          placemarksRef.current.push(placemark);
        });

        if (activeRoute.points.length > 0) {
          map.setBounds(map.geoObjects.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 40,
          });
        }
      });
    }
  }, [activeRoute]);
  
  if (!activeRoute) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-300 text-sm font-medium italic">
        Нет активного маршрута
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black text-brand-indigo uppercase tracking-widest">Активный маршрут</h3>
        <button onClick={() => onEditRoute(activeRoute)} className="p-2.5 bg-brand-sky/10 text-brand-sky hover:bg-brand-sky/20 rounded-xl transition-all active:scale-90">
            <Icon name="Pencil" size={16} />
        </button>
      </div>
      <div className="w-full aspect-[4/5] md:aspect-[16/9] rounded-[2rem] overflow-hidden relative border border-slate-200 shadow-inner bg-slate-50 group">
        <div ref={mapRef} className="w-full h-full"></div>
      </div>
       <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-sky/10 text-brand-sky flex items-center justify-center">
              <Icon name="Map" size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Маршрут</p>
              <p className="text-lg font-black text-brand-indigo">{activeRoute.date}</p>
            </div>
          </div>
          <button
            onClick={() => onEditRoute(activeRoute)}
            className="p-2.5 bg-brand-sky/10 text-brand-sky hover:bg-brand-sky/20 rounded-xl transition-all active:scale-90"
            title="Редактировать маршрут"
          >
            <Icon name="Pencil" size={18} />
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Точки маршрута:</h4>
          <div className="space-y-2">
            {activeRoute.points?.map((point, idx) => (
              <div key={point.id} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-sky text-white font-black flex items-center justify-center text-xs shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">{point.title}</p>
                  <p className="text-xs text-slate-500">
                    {point.budget ? `${point.budget.toLocaleString("ru-RU")} ₽` : 'Бесплатно'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Общий бюджет</span>
            <span className="text-xl font-black text-brand-indigo">{activeRoute.budget?.toLocaleString("ru-RU")} ₽</span>
          </div>
        </div>
      </div>
    </div>
  );
}
