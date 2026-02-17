function LandingPage({ scenario, setScenario, onStart }) {
  const [searchQuery, setSearchQuery] = React.useState('');
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
    onStart(query || searchQuery, target || 'chat');
  };

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
      breakdown: [40, 35, 25],
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
      breakdown: [30, 55, 15],
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
      breakdown: [35, 40, 25],
      routeCount: '2.5к',
      temp: '+18°',
      weatherIcon: 'Cloud',
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
      desc: 'Просто напишите свои пожелания. Наша система проанализирует тысячи вариантов и соберет идеальный маршрут под ваш бюджет.',
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
      desc: 'Да, мы ищем реальные рейсы и отели. В конце вы получите ссылки на бронирование.',
      image:
        'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop',
    },
  ];

  return (
    <div className="relative flex flex-col min-h-full bg-white">
      {/* 1. CINEMATIC HERO SECTION (Layla Style) */}
      <div className="relative h-[95vh] md:h-screen flex flex-col items-center justify-center overflow-hidden">
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
            <div className="bg-white/10 backdrop-blur-3xl p-1.5 md:p-2.5 rounded-[2.5rem] md:rounded-[4rem] border border-white/20 shadow-2xl shadow-black/20">
              <div className="bg-white rounded-[2.2rem] md:rounded-[3.5rem] flex items-center p-1 md:p-2 pr-2 md:pr-4 focus-within:ring-4 focus-within:ring-brand-sky/10 transition-all">
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
                  onClick={() => handleSearch(searchQuery, 'chat')}
                  className="w-14 h-14 md:w-20 md:h-20 bg-brand-amber text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
                >
                  <Icon name="ArrowLeft" size={32} className="rotate-180" />
                </button>
              </div>
            </div>

            {/* Context suggestions */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {QUICK_FILTERS.map((filter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(filter.query, 'chat')}
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
          {/* STATISTICS GRID */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-10 mb-32">
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-black text-brand-indigo mb-2">
                14k+
              </div>
              <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">
                Маршрутов
              </div>
            </div>
            <div className="w-px h-16 bg-slate-100 hidden md:block"></div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-black text-emerald-500 mb-2">
                15%
              </div>
              <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">
                Экономия
              </div>
            </div>
            <div className="w-px h-16 bg-slate-100 hidden md:block"></div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-black text-brand-amber mb-2">
                24/7
              </div>
              <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">
                В любое время
              </div>
            </div>
          </div>

          {/* POPULAR DESTINATIONS */}
          <div className="mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <h2 className="text-4xl md:text-7xl font-black text-brand-indigo tracking-tight">
                Популярное <br /> <span className="text-brand-sky">сейчас</span>
              </h2>
              <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex gap-2 overflow-x-auto no-scrollbar md:overflow-visible md:flex-nowrap pb-2">
                  {['Все', 'Активный', 'Пляж', 'Романтика'].map((f) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-16">
              {RESULTS.filter(
                (tour) =>
                  selectedFilter === 'Все' ||
                  tour.tags.some((tag) => tag.includes(selectedFilter)),
              ).map((res) => (
                <div
                  key={res.id}
                  onClick={() => handleSearch(res.title, 'routes')}
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
                        <Icon name="MapPin" size={14} />
                        <span>{res.routeCount} маршрутов</span>
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

          {/* FAQ ZIGZAG */}
          <div className="pt-12 md:pt-24">
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
