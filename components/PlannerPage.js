function PlannerPage({ onBack }) {
  const categories = [
    { id: 'city', label: 'Город', icon: 'MapPin' },
    { id: 'hotel', label: 'Отель', icon: 'Hotel' },
    { id: 'food', label: 'Еда', icon: 'Utensils' },
    { id: 'museum', label: 'Места', icon: 'Landmark' },
    { id: 'transport', label: 'Транспорт', icon: 'Plane' },
  ];

  return (
    <div className="bg-white min-h-screen w-full max-w-full">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 w-full">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-brand-indigo mb-4 flex items-center gap-1 text-sm font-medium transition-colors"
        >
          <Icon name="ArrowLeft" size={16} /> Назад
        </button>

        <h2 className="text-2xl md:text-4xl font-extrabold text-brand-indigo leading-tight mb-8">
          Моё путешествие
        </h2>

        <div className="mb-10 overflow-x-auto md:overflow-x-visible no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex md:grid md:grid-cols-5 gap-3 md:gap-4 min-w-max md:min-w-0 pb-2 pr-4 md:pr-0">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex-1 flex items-center justify-between gap-1 p-2 md:p-1.5 px-3 md:px-2 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-brand-sky transition-all cursor-pointer group shrink-0 overflow-hidden w-[150px] md:w-auto"
              >
                <div className="flex items-center gap-1.5 md:gap-2 shrink-0 overflow-hidden">
                  <div className="p-1.5 md:p-1.5 bg-slate-50 group-hover:bg-brand-sky/10 rounded-lg text-slate-500 group-hover:text-brand-sky transition-colors shrink-0">
                    <Icon name={cat.icon} size={14} />
                  </div>
                  <span className="font-bold text-[13px] text-brand-indigo whitespace-nowrap truncate">
                    {cat.label}
                  </span>
                </div>

                {/* ИСПРАВЛЕНО: Фон иконки "+" теперь синий (bg-brand-sky) */}
                <div className="w-4 h-4 md:w-[18px] md:h-[18px] rounded-full bg-brand-sky text-white flex items-center justify-center shadow-sm shrink-0 transition-transform active:scale-90 ml-1">
                  <Icon name="Plus" size={10} className="shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 w-full">
          <div className="flex flex-col md:flex-row gap-3 items-center w-full">
            <div className="w-full md:flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-sky transition-colors">
                <Icon name="Search" size={18} />
              </div>
              <input
                type="text"
                placeholder="Поиск города или места..."
                className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-xl md:rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-brand-sky/20 outline-none text-slate-800 font-medium text-sm md:text-base placeholder:text-slate-400"
              />
            </div>
            <button className="w-full md:w-auto md:min-w-[150px] md:shrink-0 h-14 px-8 bg-brand-amber hover:bg-brand-amber/90 text-white rounded-xl md:rounded-2xl font-bold uppercase tracking-wide shadow-lg shadow-brand-amber/30 active:scale-95 transition-all text-sm md:text-base">
              СОЗДАТЬ
            </button>
          </div>
        </div>

        <div className="w-full mb-0">
          <div className="w-full aspect-[16/11] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden relative border border-slate-200 shadow-inner bg-slate-50 group">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
              <div className="text-center transform transition-transform group-hover:scale-105 pointer-events-auto">
                <div className="w-14 h-14 bg-brand-sky text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce border-4 border-white">
                  <Icon name="Map" size={28} />
                </div>
                <h3 className="text-lg md:text-2xl font-black text-slate-300 uppercase tracking-[0.2em] select-none text-center">
                  КАРТА МАРШРУТА
                </h3>
                <p className="text-xs md:text-sm text-slate-400 mt-2 font-medium max-w-[280px] mx-auto text-center leading-relaxed">
                  Маршрут появится после добавления первой точки.
                </p>
              </div>
            </div>
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="w-9 h-9 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-brand-sky transition-all active:scale-90">
                <Icon name="Plus" size={16} />
              </button>
              <button className="w-9 h-9 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-brand-sky transition-all active:scale-90 font-black">
                —
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
