function TourPage({ predefinedRoute, onBack, onStartChat, onSaveRoute }) {
  if (!predefinedRoute) return null;

  const mapRef = React.useRef(null);
  const ymapsMapRef = React.useRef(null);
  const polylineRef = React.useRef(null);
  const placemarksRef = React.useRef([]);

  React.useEffect(() => {
    if (!window.ymaps) return;

    window.ymaps.ready(() => {
      if (!mapRef.current) return;

      if (ymapsMapRef.current) {
        ymapsMapRef.current.geoObjects.removeAll();
        placemarksRef.current = [];
      } else {
        mapRef.current.innerHTML = ''; // Clear previous map if any
        ymapsMapRef.current = new window.ymaps.Map(mapRef.current, {
          center:
            predefinedRoute.points.length > 0
              ? predefinedRoute.points[0].coords
              : [55.751574, 37.573856],
          zoom: 10,
          controls: ['zoomControl'],
        });
      }

      const map = ymapsMapRef.current;

      const polyline = new window.ymaps.Polyline(
        predefinedRoute.points.map((p) => p.coords),
        {},
        {
          strokeColor: '#0ea5e9',
          strokeWidth: 4,
          strokeStyle: 'shortdash',
        },
      );
      map.geoObjects.add(polyline);
      polylineRef.current = polyline;

      predefinedRoute.points.forEach((point, index) => {
        const placemark = new window.ymaps.Placemark(
          point.coords,
          {
            iconContent: String(index + 1),
            balloonContentHeader: point.title,
            balloonContentBody: `Бюджет: <b>${point.budget} ₽</b><br/>Дата: ${point.date}`,
          },
          {
            preset: 'islands#blueIcon',
          },
        );
        map.geoObjects.add(placemark);
        placemarksRef.current.push(placemark);
      });

      if (predefinedRoute.points.length > 0) {
        map.setBounds(map.geoObjects.getBounds(), {
          checkZoomRange: true,
          zoomMargin: 40,
        });
      }
    });

    return () => {
      if (ymapsMapRef.current) {
        ymapsMapRef.current.destroy();
        ymapsMapRef.current = null;
        polylineRef.current = null;
        placemarksRef.current = [];
      }
    };
  }, [predefinedRoute]);

  const details = {
    gallery: predefinedRoute.points.map((p) => p.image),
    fullDesc: predefinedRoute.desc,
    highlights: predefinedRoute.points.map((p) => p.title), // Use point titles as highlights
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Navbar Overlay */}
      <div className="fixed top-0 left-0 right-0 z-[110] px-4 md:px-8 py-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-indigo shadow-xl hover:scale-105 transition-all"
        >
          <Icon name="ArrowLeft" size={24} />
        </button>
        <button
          onClick={() =>
            onStartChat(
              `Собери маршрут как в маршруте "${predefinedRoute.title}"`,
            )
          }
          className="px-6 py-3 bg-brand-sky text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-sky/20 hover:scale-105 active:scale-95 transition-all"
        >
          Собрать такой маршрут
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <img
          src={predefinedRoute.img}
          className="w-full h-full object-cover animate-slow-zoom"
          alt={predefinedRoute.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-12 left-0 right-0 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {predefinedRoute.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1.5 bg-brand-amber text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight mb-4 drop-shadow-2xl">
              {predefinedRoute.title}
            </h1>
            <div className="flex items-center gap-2 text-white font-bold">
              <Icon name="Calendar" size={20} />
              <span>
                {predefinedRoute.points.length}{' '}
                {predefinedRoute.points.length === 1
                  ? 'точка'
                  : predefinedRoute.points.length >= 2 &&
                      predefinedRoute.points.length <= 4
                    ? 'места'
                    : 'точек'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12">
          {/* Main Info */}
          <div>
            <h2 className="text-3xl font-black text-brand-indigo mb-8 uppercase tracking-tight">
              О маршруте
            </h2>
            <p className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed mb-12">
              {details.fullDesc}
            </p>

            <h3 className="text-2xl font-black text-brand-indigo mb-6 uppercase tracking-tight">
              Карта маршрута
            </h3>
            <div className="w-full aspect-[4/5] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden relative border border-slate-200 shadow-inner bg-slate-50 group mb-12">
              <div ref={mapRef} className="w-full h-full"></div>
            </div>

            <h3 className="text-2xl font-black text-brand-indigo mb-8 uppercase tracking-tight">
              Места маршрута
            </h3>
            <div className="space-y-12 mb-12">
              {predefinedRoute.points.map((point, idx) => (
                <div key={idx} className="border-b border-slate-200 pb-8 last:border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-brand-sky text-white font-black flex items-center justify-center text-sm">
                      {idx + 1}
                    </div>
                    <h4 className="text-xl font-black text-brand-indigo">{point.title}</h4>
                    <span className="ml-auto text-brand-indigo font-black">
                      {point.budget.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium mb-4">
                    Дата: <span className="text-slate-800 font-bold">{new Date(point.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-md group">
                      <img
                        src={point.image}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={point.title}
                      />
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-md group">
                      <img
                        src={point.image}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={point.title}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div>
            <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 sticky top-32">
              <div className="mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Общая стоимость маршрута
                </span>
                <div className="text-4xl font-black text-brand-indigo">
                  {predefinedRoute.total}
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <h4 className="text-sm font-black text-brand-indigo uppercase tracking-widest border-b border-slate-200 pb-2">
                  Что включено:
                </h4>
                <ul className="space-y-4">
                  {predefinedRoute.points.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-slate-600 font-bold"
                    >
                      <div className="mt-1 bg-emerald-500 rounded-full p-1 shrink-0">
                        <Icon name="Check" size={12} className="text-white" />
                      </div>
                      <span>{point.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSaveRoute(predefinedRoute)}
                className="w-full py-5 bg-brand-indigo text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-indigo/20 hover:brightness-90 active:scale-95 transition-all"
              >
                Сохранить<br />маршрут
              </button>

              <div className="text-center mt-6 flex flex-col items-center gap-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  Есть вопросы?
                </p>
                <button
                  onClick={() =>
                    onStartChat(
                      `Расскажи подробнее про маршрут "${predefinedRoute.title}"`,
                    )
                  }
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                >
                  Спроси AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
