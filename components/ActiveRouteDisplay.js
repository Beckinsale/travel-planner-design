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
       <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm transition-all">
          <p className="text-sm font-bold text-brand-indigo mb-2">Маршрут от {activeRoute.date}</p>
          <ul className="list-disc list-inside text-sm text-slate-700 mb-4">
            {activeRoute.points?.map((point, index) => (
              <li key={point.id}>{index + 1}. {point.title} (Бюджет: {point.budget?.toLocaleString("ru-RU")} ₽)</li>
            ))}
          </ul>
          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Общий бюджет</span>
              <span className="font-black text-brand-indigo">{activeRoute.budget?.toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>
        </div>
    </div>
  );
}
