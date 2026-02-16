function PlannerPage({ onBack }) {
  const [activeTab, setActiveTab] = React.useState('my');
  const [selectedFilter, setSelectedFilter] = React.useState('Все');

  const categories = [
    { id: 'city', label: 'Город', icon: 'MapPin' },
    { id: 'hotel', label: 'Отель', icon: 'Hotel' },
    { id: 'food', label: 'Еда', icon: 'Utensils' },
    { id: 'museum', label: 'Места', icon: 'Landmark' },
    { id: 'transport', label: 'Транспорт', icon: 'Plane' },
  ];

  const POPULAR_TOURS = [
    {
      id: 1,
      title: 'Сочи: Горы и Море',
      desc: 'Идеальный баланс: 2 дня в горах, 3 дня на побережье.',
      total: '45 000 ₽',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
      tags: ['⚡ Активный', 'РФ'],
      routeCount: '1.2к',
      temp: '+12°',
      weatherIcon: 'CloudSun',
    },
    {
      id: 2,
      title: 'ОАЭ: Дубай',
      desc: 'Футуристичные небоскребы и сафари в золотых песках.',
      total: '85 000 ₽',
      img: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['⚡ Активный', 'ОАЭ'],
      routeCount: '4.2к',
      temp: '+32°',
      weatherIcon: 'Sun',
    },
    {
      id: 3,
      title: 'Мальдивы: Рай',
      desc: 'Райский отдых на воде с видом на бескрайний океан.',
      total: '125 000 ₽',
      img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2070&auto=format&fit=crop',
      tags: ['🌴 Пляж', 'Мальдивы'],
      routeCount: '1.8к',
      temp: '+29°',
      weatherIcon: 'Sun',
    },
    {
      id: 4,
      title: 'Турция: Каппадокия',
      desc: 'Полет на шарах над долиной сказочных дымоходов.',
      total: '65 000 ₽',
      img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2000&auto=format&fit=crop',
      tags: ['🎈 Романтика', 'Турция'],
      routeCount: '2.5к',
      temp: '+18°',
      weatherIcon: 'Cloud',
    },
  ];

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
              Мои
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
            <div className="relative -mx-4 px-4 md:mx-0 md:px-0 mb-10">
              <div className="overflow-x-auto md:overflow-x-visible no-scrollbar">
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
                      <div className="w-4 h-4 md:w-[18px] md:h-[18px] rounded-full bg-brand-sky text-white flex items-center justify-center shadow-sm shrink-0 transition-transform active:scale-90 ml-1">
                        <Icon name="Plus" size={10} className="shrink-0" />
                      </div>
                    </div>
                  ))}
                  <div className="w-12 shrink-0 md:hidden"></div>
                </div>
              </div>
              <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none md:hidden z-10"></div>
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
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-brand-sky/20 outline-none text-slate-800 font-medium text-sm md:text-base placeholder:text-slate-400"
                  />
                </div>
                <button className="w-full md:w-auto md:min-w-[150px] md:shrink-0 h-14 px-8 bg-brand-amber hover:bg-brand-amber/90 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-brand-amber/30 active:scale-95 transition-all text-sm md:text-base">
                  СОЗДАТЬ
                </button>
              </div>
            </div>

            <div className="w-full aspect-[4/5] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden relative border border-slate-200 shadow-inner bg-slate-50 group">
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
                <button className="w-9 h-9 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-brand-sky transition-all active:scale-90 shadow-sm">
                  <Icon name="Plus" size={16} />
                </button>
                <button className="w-9 h-9 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-brand-sky transition-all active:scale-90 font-black shadow-sm">
                  —
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* СПИСОК ПОПУЛЯРНЫХ МАРШРУТОВ */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-full mb-10">
              <div className="relative group mb-8">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-sky transition-colors"><Icon name="MapPin" size={20} /></div>
                <input type="text" defaultValue="Москва" className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl md:rounded-2xl border-none focus:ring-2 focus:ring-brand-sky/20 outline-none text-slate-800 font-bold text-base md:text-lg transition-all placeholder:text-slate-400" />
              </div>

              <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex gap-2 overflow-x-auto no-scrollbar md:overflow-visible md:flex-nowrap pb-2">
                  {['Все', 'Активный', 'Пляж', 'Романтика'].map(f => (
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
                      {f === 'Пляж' && <span className="text-sm">🌴</span>}
                      {f === 'Романтика' && <span className="text-sm">🎈</span>}
                      {f}
                    </button>
                  ))}
                  <div className="w-12 shrink-0 md:hidden"></div>
                </div>
                <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none md:hidden z-10"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 pb-24">
              {POPULAR_TOURS.filter(tour => selectedFilter === 'Все' || tour.tags.some(tag => tag.includes(selectedFilter))).map((res, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative aspect-[4/5] md:aspect-[16/10] rounded-[3rem] overflow-hidden mb-6 shadow-2xl isolation-auto">
                    <img
                      src={res.img}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 rounded-[3rem] will-change-transform"
                      alt={res.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-[3rem]"></div>
                    <div className="absolute top-6 left-6">
                      <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg">
                        <Icon name={res.weatherIcon} size={14} /> {res.temp}
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8 text-left">
                      <h3 className="text-2xl md:text-4xl font-black text-white mb-1 tracking-tight leading-none drop-shadow-2xl">
                        {res.title}
                      </h3>
                      <div className="flex items-center gap-2 text-white/90 font-bold text-xs uppercase tracking-widest mb-4 drop-shadow-lg">
                        <Icon name="MapPin" size={14} />
                        <span>{res.routeCount} маршрутов</span>
                      </div>
                      <div className="bg-brand-amber text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest inline-block shadow-xl">
                        {res.total}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed px-4 text-left">
                    {res.desc}
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
