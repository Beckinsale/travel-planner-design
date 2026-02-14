function RecommendationsPage({ onBack }) {
  const recommendations = [
    {
      id: 1,
      route: 'Москва → Стамбул → Анталья',
      price: '55 000 ₽',
      time: '5ч 30м',
    },
    {
      id: 2,
      route: 'Москва → Дубай → Пхукет',
      price: '72 000 ₽',
      time: '12ч 10м',
    },
    {
      id: 3,
      route: 'Алматы → Тбилиси → Батуми',
      price: '48 000 ₽',
      time: '6ч 15м',
    },
    {
      id: 4,
      route: 'Ереван → Рим → Милан',
      price: '60 000 ₽',
      time: '8ч 45м',
    },
    {
      id: 5,
      route: 'Стамбул → Париж → Лиссабон',
      price: '85 000 ₽',
      time: '14ч 20м',
    },
  ];

  // Логика шторки
  const [sheetHeight, setSheetHeight] = React.useState(60);
  const [isDragging, setIsDragging] = React.useState(false);
  const startY = React.useRef(0);
  const startHeight = React.useRef(0);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    startHeight.current = sheetHeight;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = startY.current - currentY;
    const windowHeight = window.innerHeight;
    const deltaPercent = (deltaY / windowHeight) * 100;
    let newHeight = startHeight.current + deltaPercent;

    if (newHeight < 20) newHeight = 20;
    if (newHeight > 95) newHeight = 95;
    setSheetHeight(newHeight);
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className="w-full h-auto md:h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-white relative md:overflow-visible">
      {/* КАРТА (ФОН) */}
      <div className="absolute inset-0 h-full md:relative md:h-full md:sticky md:top-16 md:flex-1 order-1 md:order-2 border-l border-slate-100 bg-slate-50 group z-0">
        <div className="absolute inset-0 flex items-start md:items-center justify-center pt-[12vh] md:pt-0 pointer-events-none px-4">
          <div className="text-center transform transition-transform group-hover:scale-105 pointer-events-auto">
            {/* ИСПРАВЛЕНО: ТЕПЕРЬ СИНИЙ (brand-sky), КАК В PLANNER PAGE */}
            <div className="w-14 h-14 bg-brand-sky text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce border-4 border-white">
              <Icon name="Map" size={28} />
            </div>
            <h3 className="text-lg md:text-2xl font-black text-slate-300 uppercase tracking-[0.2em] select-none text-center">
              КАРТА РЕКОМЕНДАЦИЙ
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mt-2 font-medium max-w-[280px] mx-auto text-center leading-relaxed">
              Визуализация выбранного маршрута
            </p>
          </div>
        </div>

        {/* Кнопки зума (только десктоп) */}
        <div className="hidden md:flex absolute bottom-6 right-6 flex flex-col gap-2">
          <button className="w-9 h-9 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-brand-sky transition-all active:scale-90">
            <Icon name="Plus" size={16} />
          </button>
          <button className="w-9 h-9 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-brand-sky transition-all active:scale-90 font-black">
            —
          </button>
        </div>
      </div>

      {/* ШТОРКА С РЕКОМЕНДАЦИЯМИ */}
      <div
        className="absolute bottom-0 w-full md:static md:h-auto md:w-[420px] lg:w-[480px] order-2 md:order-1 flex flex-col bg-white z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] md:shadow-xl md:border-r border-slate-200 rounded-t-[2.5rem] md:rounded-none md:min-h-full transition-height duration-75 ease-out"
        style={{
          height: window.innerWidth < 768 ? `${sheetHeight}%` : 'auto',
        }}
      >
        {/* Хедер шторки */}
        <div className="w-full pt-3 pb-1 shrink-0 bg-white rounded-t-[2.5rem] md:rounded-none border-b border-slate-50">
          <div
            className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2 md:hidden cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          ></div>

          <div className="px-4 md:px-6 py-2 flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-slate-400 hover:text-brand-indigo flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Icon name="ArrowLeft" size={16} /> Назад
            </button>
            <div className="flex gap-4 text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Icon name="Calendar" size={14} /> 15-20 Окт
              </span>
            </div>
          </div>
        </div>

        {/* Контент списка */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4 rounded-b-none md:rounded-none">
          <h2 className="text-xl font-bold text-brand-indigo px-2 mb-2 hidden md:block">
            Рекомендуемые
          </h2>

          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-brand-sky/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-sky/10 text-brand-sky flex items-center justify-center shrink-0">
                  <Icon name="Plane" size={20} />
                </div>
                <div className="font-bold text-brand-indigo text-sm md:text-base">
                  {rec.route}
                </div>
              </div>
              <div className="flex gap-3 text-xs md:text-sm">
                <span className="px-2.5 py-1 rounded-lg bg-brand-amber/10 text-brand-indigo font-semibold border border-brand-amber/20 flex items-center gap-1">
                  <Icon name="CreditCard" size={12} /> {rec.price}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1">
                  <Icon name="Clock" size={12} /> {rec.time}
                </span>
              </div>
            </div>
          ))}

          <div className="pt-2 flex justify-center pb-8 md:pb-4">
            <button className="flex items-center gap-2 text-brand-indigo font-semibold text-sm hover:bg-brand-sky/10 px-4 py-2 rounded-xl transition-colors">
              <Icon name="RefreshCw" size={16} /> Обновить список
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
