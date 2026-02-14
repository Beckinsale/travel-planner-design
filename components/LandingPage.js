function LandingPage({ scenario, setScenario, onStart }) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (query, target) => {
    // target может быть 'chat' или 'routes'
    onStart(query || searchQuery, target || 'chat');
  };

  // 4 ГОТОВЫХ ВАРИАНТА
  const RESULTS = [
    {
      id: 1,
      title: 'Сочи: Горы и Море',
      desc: 'Идеальный баланс: 2 дня в горах, 3 дня на побережье.',
      total: '45 000 ₽',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
      tags: ['⚡ Активный', 'РФ'],
      breakdown: [30, 50, 20],
      routeCount: '1.2к',
    },
    {
      id: 2,
      title: 'ОАЭ: Дубай',
      desc: 'Футуристичные небоскребы и сафари в золотых песках.',
      total: '85 000 ₽',
      img: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['⚡ Активный', 'ОАЭ'],
      breakdown: [40, 35, 25],
      routeCount: '4.2к',
    },
    {
      id: 3,
      title: 'Мальдивы: Рай',
      desc: 'Райский отдых на воде с видом на бескрайний океан.',
      total: '125 000 ₽',
      img: 'https://images.pexels.com/photos/1287441/pexels-photo-1287441.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['🌴 Пляж', 'Мальдивы'],
      breakdown: [30, 55, 15],
      routeCount: '1.8к',
    },
    {
      id: 4,
      title: 'Турция: Каппадокия',
      desc: 'Полет на шарах над долиной сказочных дымоходов.',
      total: '65 000 ₽',
      img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2000&auto=format&fit=crop',
      tags: ['🎈 Романтика', 'Турция'],
      breakdown: [35, 40, 25],
      routeCount: '2.5к',
    },
  ];

  // ОБНОВЛЕННЫЕ ЧИПСЫ
  const QUICK_FILTERS = [
    { icon: '👍', label: 'Очень хвалят', query: 'Рекомендуемое' },
    { icon: '🌊', label: 'Хочу на море', query: 'Море' },
    { icon: '🔥', label: 'Хит сезона', query: 'Популярное' },
    { icon: '⚡', label: 'Лучшее из недорогих', query: 'Бюджетно' },
    { icon: '🌴', label: 'Пляж', query: 'Пляжный отдых' },
    { icon: '🏔️', label: 'Горы', query: 'Горы' },
  ];

  // FAQ
  const FAQ_CARDS = [
    {
      id: 1,
      title: 'Как работает сервис?',
      desc: 'Просто напиши свои пожелания. Мы проанализируем тысячи вариантов и соберем идеальный маршрут под твой бюджет.',
      image:
        'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2064&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Откуда статистика?',
      desc: 'Показатели созданных маршрутов и экономии бюджета рассчитываются на данных, полученных за последние 6 месяцев.',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'А билеты настоящие?',
      desc: 'Да, мы ищем реальные рейсы и отели. В конце ты получишь ссылки на бронирование.',
      image:
        'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop',
    },
  ];

  return (
    <div className="relative flex flex-col min-h-full">
      {/* Фон */}
      <div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-to-b from-brand-bg via-white to-transparent pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-6 md:pt-32 pb-10 md:pb-20 w-full">
        <div className="flex flex-col items-center">
          {/* 1. ЗАГОЛОВОК */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-brand-indigo mb-4 tracking-tight leading-tight">
              Запланируй маршрут <br />
              <span className="text-brand-sky">за 2 минуты</span>
            </h1>
          </div>

          {/* 2. ТЕКСТ ПРИЗЫВА (ПОДНЯТ ВЫШЕ, СКРЫТ НА МОБИЛКЕ) */}
          <div className="text-center mb-8 md:mb-12 px-4 font-medium max-w-2xl mx-auto hidden md:block">
            <p className="text-slate-500 text-sm sm:text-base md:text-xl leading-relaxed">
              Не просто билеты — полноценный маршрут с контролем расходов.
              AI-подбор, черновики и карта.
            </p>
          </div>

          {/* 3. ФОРМА ПОИСКА */}
          <div className="w-full bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(30,27,75,0.1)] border border-slate-100 p-2 mb-8 relative z-20">
            <div className="flex flex-col md:flex-row gap-2 px-1 pb-1 md:gap-3 md:px-2 md:pb-2 items-center">
              <div className="w-full relative group">
                <textarea
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Куда отправимся?
Например: Алтай за 40 000 руб.`}
                  rows="2"
                  className="w-full h-24 md:h-28 pl-4 pr-14 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-sky/20 focus:bg-white outline-none text-slate-800 font-bold text-base md:text-xl placeholder:text-slate-400 placeholder:font-normal transition-all resize-none overflow-hidden"
                />
                <button
                  title="Голосовой ввод"
                  className="absolute right-3 bottom-3 p-3 text-slate-400 hover:text-brand-sky hover:bg-brand-sky/10 rounded-xl transition-all active:scale-90 group"
                >
                  <Icon name="Mic" size={24} className="group-hover:animate-pulse" />
                </button>
              </div>

              <button
                onClick={() => handleSearch(searchQuery, 'chat')}
                className="w-full md:w-auto md:min-w-[180px] h-16 md:h-20 px-8 bg-brand-amber hover:bg-brand-amber/90 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 text-base md:text-lg font-black uppercase tracking-tight shrink-0"
              >
                ПОДОБРАТЬ
              </button>
            </div>

            {/* ЧИПСЫ */}
            <div className="px-2 pb-2 pt-1 flex flex-wrap gap-2 justify-center md:justify-start">
              {QUICK_FILTERS.map((filter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(filter.query, 'chat')}
                  className="px-3.5 py-2 md:px-6 md:py-3 bg-white border border-slate-100 rounded-xl text-slate-600 text-[11px] md:text-base font-bold hover:bg-brand-sky/5 hover:border-brand-sky/20 hover:text-brand-indigo transition-all active:scale-95 flex items-center gap-1.5 md:gap-2"
                >
                  <span className="text-sm md:text-lg">{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. СТАТИСТИКА (ИСПРАВЛЕНО ОТОБРАЖЕНИЕ) */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12 md:mb-20 px-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Icon name="Map" size={16} className="text-brand-sky/60" />
              <span className="text-xs md:text-sm font-bold tracking-wide uppercase">
                <span className="text-slate-600">14 280</span> маршрутов создано
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Icon name="CreditCard" size={16} className="text-brand-amber/60" />
              <span className="text-xs md:text-sm font-bold tracking-wide uppercase">
                <span className="text-emerald-600">~15%</span> экономии бюджета
              </span>
            </div>
          </div>
        </div>

        {/* --- RESULTS SECTION --- */}
        <div id="results-section" className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
            <h2 className="text-2xl font-black text-brand-indigo">
              Актуально прямо сейчас
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {RESULTS.map((res) => (
              <div
                key={res.id}
                onClick={() => handleSearch(res.title, 'routes')}
                className="bg-white rounded-[2rem] p-3 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col transition-all duration-300 relative group cursor-pointer hover:border-brand-sky/30"
              >
                <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-rose-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-black shadow-lg shadow-rose-500/30">
                  <Icon name="Map" size={14} className="md:size-4 text-white" />
                  <span>{res.routeCount}</span>
                </div>

                <div className="h-48 md:h-64 rounded-[1.5rem] overflow-hidden relative mb-4">
                  <img src={res.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={res.title} />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {res.tags.map((tag) => (
                      <span key={tag} className="bg-white/95 backdrop-blur px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold text-slate-800 shadow-sm">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="px-2 pb-2 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-black text-xl md:text-2xl text-brand-indigo leading-tight max-w-[70%] group-hover:text-brand-sky transition-colors">{res.title}</h3>
                    <span className="bg-brand-indigo/5 text-brand-indigo px-3 py-2 md:px-5 md:py-3 rounded-xl text-base md:text-xl font-black whitespace-nowrap">{res.total}</span>
                  </div>
                  <p className="text-sm md:text-base text-slate-500 font-medium mb-6 leading-relaxed">{res.desc}</p>

                  <div className="mt-auto">
                    <div className="flex justify-between text-[10px] md:text-xs text-slate-400 font-bold mb-1.5 md:mb-2 uppercase tracking-wider"><span>Бюджет тура</span></div>
                    <div className="w-full h-1.5 md:h-2 bg-slate-100 rounded-full overflow-hidden flex mb-2.5 md:mb-3">
                      <div className="h-full bg-brand-indigo" style={{ width: `${res.breakdown[0]}%` }}></div>
                      <div className="h-full bg-brand-amber" style={{ width: `${res.breakdown[1]}%` }}></div>
                      <div className="h-full bg-brand-sky" style={{ width: `${res.breakdown[2]}%` }}></div>
                    </div>
                    <div className="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-brand-indigo"></div>
                        <span className="text-[8px] md:text-xs text-slate-400 font-bold uppercase whitespace-nowrap">Дорога</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-brand-amber"></div>
                        <span className="text-[8px] md:text-xs text-slate-400 font-bold uppercase whitespace-nowrap">Отель</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-brand-sky"></div>
                        <span className="text-[8px] md:text-xs text-slate-400 font-bold uppercase whitespace-nowrap">Досуг</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="grid grid-cols-1 gap-8 md:gap-16 pt-6 md:pt-10 border-t border-slate-100">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-2xl font-black text-brand-indigo">Частые вопросы</h2>
          </div>
          {FAQ_CARDS.map((card, idx) => (
            <div key={card.id} className={`flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-1/3 h-56 md:h-80 relative overflow-hidden">
                <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              </div>
              <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                <h4 className="text-xl md:text-3xl font-black text-brand-indigo mb-4 leading-tight">{card.title}</h4>
                <p className="text-slate-500 leading-relaxed text-sm md:text-lg font-medium">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
