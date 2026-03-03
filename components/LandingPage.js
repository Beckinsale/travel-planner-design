function LandingPage({ scenario, setScenario, onStart, onTourSelect, onManualFormSubmit }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchMode, setSearchMode] = React.useState('ai');
  const [manualForm, setManualForm] = React.useState({
    from: '',
    to: '',
    dateFrom: '',
    dateTo: '',
    budget: ''
  });
  const [selectedFilter, setSelectedFilter] = React.useState('Все');
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const videoRef = React.useRef(null);

  // Адаптивное количество строк для поиска (Mobile First logic)
  const [inputRows, setInputRows] = React.useState(3);
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      if (width >= 768) {
        setInputRows(1); // Планшеты и десктопы
      } else if (width >= 375) {
        setInputRows(2); // Стандартные мобильные
      } else {
        setInputRows(3); // Маленькие экраны (< 375px)
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Максимально устойчивый запуск видео для Opera Mobile
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Явно задаем свойства через JS до начала попыток воспроизведения
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', ''); // Дублируем для верности в атрибуты DOM

    const handlePlay = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise.then(() => {
          setIsVideoLoaded(true);
          cleanup();
        }).catch(() => {
          // Автозапуск заблокирован — ждем действий пользователя
        });
      }
    };

    const cleanup = () => {
      ['touchstart', 'mousedown', 'scroll', 'click', 'keydown'].forEach(event => {
        window.removeEventListener(event, handlePlay);
      });
    };

    // 1. Пытаемся запустить сразу
    handlePlay();

    // 2. Слушаем все возможные жесты
    ['touchstart', 'mousedown', 'scroll', 'click', 'keydown'].forEach(event => {
      window.addEventListener(event, handlePlay, { passive: true });
    });

    // 3. Дополнительный триггер при смене видимости (вход во вкладку)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') handlePlay();
    });

    return cleanup;
  }, [isDesktop]);

  const handleSearch = (query, target) => {
    onStart(query || searchQuery);
  };

  const RESULTS = [
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
        { id: 1, title: 'Листвянка', coords: [51.8687, 104.8943], budget: 5000, date: '2026-02-01' },
        { id: 2, title: 'Ольхон', coords: [53.0784, 107.4103], budget: 10000, date: '2026-02-03' },
        { id: 3, title: 'Бухта Песчаная', coords: [52.3382, 105.7196], budget: 2000, date: '2026-02-02' },
      ],
      budget: 17000,
    },
    {
      id: 2,
      title: 'Алтай: Золотые Горы',
      desc: 'Дикая природа, бирюзовая Катунь и бескрайние степи.',
      total: '55 000 ₽',
      img: 'https://images.pexels.com/photos/10103738/pexels-photo-10103738.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['⚡ Активный', 'РФ'],
      routeCount: '2.8к',
      temp: '+8°',
      weatherIcon: 'Sun',
      points: [
        { id: 1, title: 'Горно-Алтайск', coords: [51.9562, 85.9616], budget: 7000, date: '2026-08-01' },
        { id: 2, title: 'Телецкое озеро', coords: [51.7456, 87.2023], budget: 9000, date: '2026-08-03' },
        { id: 3, title: 'Чуйский тракт', coords: [50.3150, 86.8200], budget: 3000, date: '2026-08-05' },
      ],
      budget: 19000,
    },
    {
      id: 3,
      title: 'Сочи: Горы и Море',
      desc: 'Идеальный баланс: 2 дня в горах, 3 дня на побережье.',
      total: '45 000 ₽',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
      tags: ['⚡ Активный', 'РФ'],
      routeCount: '1.2к',
      temp: '+12°',
      weatherIcon: 'CloudSun',
      points: [
        { id: 1, title: 'Красная Поляна', coords: [43.6826, 40.2337], budget: 8000, date: '2026-06-01' },
        { id: 2, title: 'Олимпийский парк', coords: [43.4000, 39.9500], budget: 4000, date: '2026-06-02' },
        { id: 3, title: 'Дендрарий Сочи', coords: [43.5683, 39.7303], budget: 2000, date: '2026-06-03' },
      ],
      budget: 14000,
    },
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
        { id: 1, title: 'Петропавловск-Камчатский', coords: [53.0452, 158.6483], budget: 15000, date: '2026-09-01' },
        { id: 2, title: 'Вулкан Мутновский', coords: [52.4500, 157.6833], budget: 20000, date: '2026-09-03' },
        { id: 3, title: 'Долина гейзеров', coords: [54.4500, 160.0000], budget: 25000, date: '2026-09-05' },
      ],
      budget: 60000,
    },
  ];

  const QUICK_FILTERS = [
    { icon: '👍', label: 'Очень хвалят', query: 'Рекомендуемое' },
    { icon: '🌊', label: 'Хочу на море', query: 'Море' },
    { icon: '🔥', label: 'Хит сезона', query: 'Популярное' },
    { icon: '⚡', label: 'Лучшее из недорогих', query: 'Бюджетно' },
  ];

    const FAQ_CARDS = [
      {
        id: 1,
        title: 'Как работает сервис?',
              desc: 'Наш алгоритм анализирует ваши предпочтения и подбирает оптимальные локации в РФ. Мы убрали всё лишнее, чтобы вы не тратили часы на изучение форумов и отзывов.',
        image:
          'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2064&auto=format&fit=crop',
      },
      {
        id: 2,
        title: 'Используются реальные данные?',
        desc: 'Используются реальные агрегированные данные и AI-моделирование бюджета.',
        image:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop',
      },
      {
        id: 3,
        title: 'Можно ли редактировать маршрут?',
        desc: 'Можно добавлять и удалять точки, изменять бюджет и настраивать маршрут под себя.',
        image:
          'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop',
      },
    ];

  return (
    <div className="relative flex flex-col min-h-full bg-white">
      {/* 1. CINEMATIC HERO SECTION (Layla Style) */}
      <div className="relative h-auto md:h-screen flex flex-col items-center justify-start md:justify-center overflow-hidden py-8 md:py-0">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center z-[-1]" 
            style={{ backgroundImage: 'url(./assets/video/hero-poster.jpg)' }}
          ></div>
          <video
            ref={videoRef}
            key={isDesktop ? 'hd' : 'sd'}


            
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onCanPlay={() => {
              if (videoRef.current) videoRef.current.play();
            }}
            onEnded={(e) => e.target.play()}
            className="w-full h-full object-cover"
            poster="./assets/video/hero-poster.jpg"
          >
            {isDesktop ? (
              <>
                <source src="./assets/video/hero-bg-hd.webm" type="video/webm" />
                <source src="./assets/video/hero-bg-hd.mp4" type="video/mp4" />
              </>
            ) : (
              <>
                <source src="./assets/video/hero-bg-small.webm" type="video/webm" />
                <source src="./assets/video/hero-bg-small.mp4" type="video/mp4" />
              </>
            )}
          </video>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight leading-[0.9] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              Личный <br /> <span className="text-brand-sky">тревел-гид</span>
            </h1>
            <p className="text-white text-lg md:text-2xl font-medium mb-12 max-w-3xl mx-auto drop-shadow-2xl leading-relaxed">
              Планирование ещё никогда не было таким простым.
            </p>
          </div>

          {/* MINIMALIST AI SEARCH BAR */}
          <div className="w-full max-w-3xl mx-auto animate-in zoom-in-95 duration-700 delay-300">
            {/* Mode Switcher */}
            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={() => setSearchMode('ai')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all backdrop-blur-md ${
                  searchMode === 'ai'
                    ? 'bg-white text-brand-indigo border border-white shadow-lg'
                    : 'bg-white/10 border border-white/10 text-white hover:bg-white/20'
                }`}
              >
                ✨ AI-поиск
              </button>
              <button
                onClick={() => setSearchMode('manual')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all backdrop-blur-md ${
                  searchMode === 'manual'
                    ? 'bg-white text-brand-indigo border border-white shadow-lg'
                    : 'bg-white/10 border border-white/10 text-white hover:bg-white/20'
                }`}
              >
                🛠️ Ручной
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-3xl p-1.5 md:p-2.5 rounded-[2.5rem] md:rounded-[4rem] border border-white/20 shadow-2xl shadow-black/20 transition-none">
              {searchMode === 'ai' ? (
                <div className="bg-white rounded-[2.2rem] md:rounded-[3.5rem] flex items-center p-1 md:p-2 pr-2 md:pr-4 focus-within:ring-4 focus-within:ring-brand-sky/10 transition-none">
                  <div className="flex-1 relative group">
                    <textarea
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Например: Сочи за 45 000 руб на 5 дней"
                      rows={inputRows}
                      className="w-full py-3 md:py-6 pl-6 md:pl-10 pr-12 bg-transparent outline-none text-slate-800 font-bold text-base md:text-xl placeholder:text-slate-400 placeholder:font-normal resize-none overflow-hidden leading-snug md:leading-normal"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-sky transition-colors">
                      <Icon name="Mic" size={28} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleSearch(searchQuery)}
                    className="w-14 h-14 md:w-20 md:h-20 bg-brand-amber text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 shrink-0"
                  >
                    <Icon name="ArrowLeft" size={32} className="rotate-180" />
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-[2.2rem] md:rounded-[3.5rem] p-4 md:p-8 transition-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm md:text-base font-black text-slate-700 uppercase ml-3">Откуда</label>
                      <input
                        type="text"
                        placeholder="Москва"
                        value={manualForm.from}
                        onChange={(e) => setManualForm({ ...manualForm, from: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-sky/20 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm md:text-base font-black text-slate-700 uppercase ml-3">Куда</label>
                      <input
                        type="text"
                        placeholder="Алтай"
                        value={manualForm.to}
                        onChange={(e) => setManualForm({ ...manualForm, to: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-sky/20 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2 col-span-1 md:col-span-2">
                      <label className="text-sm md:text-base font-black text-slate-700 uppercase ml-3">Даты</label>
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <input
                          type="date"
                          value={manualForm.dateFrom}
                          onChange={(e) => setManualForm({ ...manualForm, dateFrom: e.target.value })}
                          placeholder="dd/mm/yyyy"
                          className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-sky/20 outline-none font-bold text-slate-700 transition-all text-base"
                        />
                        <span className="text-slate-400 font-bold shrink-0 text-lg hidden md:block">—</span>
                        <input
                          type="date"
                          value={manualForm.dateTo}
                          min={manualForm.dateFrom}
                          onChange={(e) => setManualForm({ ...manualForm, dateTo: e.target.value })}
                          placeholder="dd/mm/yyyy"
                          className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-sky/20 outline-none font-bold text-slate-700 transition-all text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm md:text-base font-black text-slate-700 uppercase ml-3">Бюджет</label>
                      <input
                        type="text"
                        placeholder="100 000 ₽"
                        value={manualForm.budget}
                        onChange={(e) => setManualForm({ ...manualForm, budget: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-sky/20 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (onManualFormSubmit) {
                        onManualFormSubmit(manualForm);
                      } else {
                        const parts = [];
                        if (manualForm.from) parts.push(`из ${manualForm.from}`);
                        if (manualForm.to) parts.push(`в ${manualForm.to}`);
                        if (manualForm.dateFrom && manualForm.dateTo) {
                          const fmt = (d) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
                          parts.push(`даты: ${fmt(manualForm.dateFrom)} — ${fmt(manualForm.dateTo)}`);
                        } else if (manualForm.dateFrom) {
                          parts.push(`с ${new Date(manualForm.dateFrom).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`);
                        }
                        if (manualForm.budget) parts.push(`бюджет: ${manualForm.budget}`);
                        const query = parts.length > 0 ? `Подобрать маршрут ${parts.join(', ')}` : '';
                        handleSearch(query);
                      }
                    }}
                    className="w-auto px-12 mt-6 py-4 bg-brand-amber text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-amber/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mx-auto"
                  >
                    Добавить
                  </button>
                </div>
              )}
            </div>

            {/* Context suggestions */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {QUICK_FILTERS.map((filter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(filter.query)}
                  className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white text-xs md:text-sm font-bold hover:bg-white/20 transition-all"
                >
                  {filter.icon} {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT (Smooth transition from hero) */}
      <div className="relative z-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-24 w-full">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-center mb-32">
                        <div className="flex flex-col items-center">
                          <h3 className="text-4xl md:text-5xl font-black text-brand-indigo tracking-tighter">AI</h3>
                          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-2">Генерация за секунды</p>
                        </div>
                        <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                        <div className="flex flex-col items-center">
                          <h3 className="text-4xl md:text-5xl font-black text-emerald-500 tracking-tighter">100%</h3>
                          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-2">Редактируемый маршрут</p>
                        </div>
                        <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                        <div className="flex flex-col items-center">
                          <h3 className="text-4xl md:text-5xl font-black text-brand-amber tracking-tighter">24/7</h3>
                          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-2">В любое время</p>
                        </div>
                      </div>

                    <div className="mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <h2 className="text-4xl md:text-7xl font-black text-brand-indigo tracking-tight">
                  Популярное <br /> <span className="text-brand-sky">сейчас</span>
                </h2>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-16">
              {RESULTS.filter(
                (tour) =>
                  selectedFilter === 'Все' ||
                  tour.tags.some((tag) => tag.includes(selectedFilter)),
              ).map((res) => (
                <div
                  key={res.id}
                  onClick={() => onTourSelect(res)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/5] md:aspect-[16/10] rounded-[3rem] overflow-hidden mb-8 shadow-2xl isolation-auto">
                    <img
                      src={res.img}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 rounded-[3rem] will-change-transform"
                      alt={res.title}
                    />
                    {/* Layla-style enhanced gradient underlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-[3rem]"></div>

                                        <div className="absolute top-6 left-6">

                                          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg">

                                            <Icon name={res.weatherIcon} size={14} /> {res.temp}

                                          </div>

                                        </div>

                    

                                        <div className="absolute bottom-6 left-6 right-6 text-left">

                                          <h3 className="text-2xl md:text-4xl font-black text-white mb-1 tracking-tight leading-tight drop-shadow-2xl">

                                            {res.title}

                                          </h3>

                    
                                            <div className="flex items-center gap-2 text-white/90 font-bold text-xs uppercase tracking-widest mb-4 drop-shadow-lg">
                                            </div>
                      <div className="bg-brand-amber text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest inline-block shadow-xl">
                        {res.total}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xl font-medium leading-relaxed px-4">
                    {res.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

                              <div className="pt-0">
            <h2 className="text-4xl md:text-7xl font-black text-brand-indigo mb-10 md:mb-20 tracking-tight">
              Ответы <br /> <span className="text-brand-sky">на вопросы</span>
            </h2>
            <div className="space-y-32">
              {FAQ_CARDS.map((card, idx) => (
                <div
                  key={card.id}
                  className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="w-full md:w-1/2 aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
                    <img
                      src={card.image}
                      className="w-full h-full object-cover"
                      alt={card.title}
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <h4 className="text-3xl md:text-5xl font-black text-brand-indigo mb-8 leading-tight tracking-tight">
                      {card.title}
                    </h4>
                    <p className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

