function AIAssistantPage({ onBack, onProfile, initialQuery, activeTab, setActiveTab, user }) {
  const [selectedFilter, setSelectedFilter] = React.useState('Все');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [inputText, setInputText] = React.useState('');
  const lastMsgRef = React.useRef(null);
  const isFirstRender = React.useRef(true);
  
  const scrollToBottom = () => {
    setTimeout(() => {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  const ALL_TOURS = [
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

  const [messages, setMessages] = React.useState([
    {
      id: 1,
      type: 'bot',
      text: 'Привет! Я **ваш личный AI тревел-гид**. Расскажите, куда хотите отправиться, и я подберу идеальный маршрут.',
    },
  ]);

  const QUICK_ACTIONS = [
    { icon: '🗺️', label: 'Маршрут', query: 'Составь маршрут в Турцию на 7 дней' },
    { icon: '💰', label: 'Бюджет', query: 'Какой бюджет нужен для поездки на Алтай?' },
    { icon: '🔥', label: 'Хиты', query: 'Какие направления сейчас самые популярные?' },
    { icon: '🌊', label: 'Море', query: 'Найди лучшие варианты для отдыха на море' },
    { icon: '🏔️', label: 'Горы', query: 'Хочу в горы, что посоветуешь?' },
    { icon: '📸', label: 'Места', query: 'Главные достопримечательности в Дубае' },
  ];

  const handleSend = (text, isMagic = false) => {
    const message = text || inputText;
    if (!message || !message.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: message };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    if (isMagic) setIsGenerating(true); else setIsTyping(true);
    
    scrollToBottom();

    setTimeout(() => {
      setIsGenerating(false);
      setIsTyping(false);
      const foundTour = ALL_TOURS.find(t => t.title === message);
      
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: foundTour 
          ? `Отличный выбор! Вот детали маршрута **${foundTour.title}**, который я подготовила:`
          : `Это отличный выбор! Я начала подбирать лучшие локации по запросу: **"${message}"**. \n\nСчитаю бюджет и строю оптимальный путь...`,
        tour: foundTour || null,
        suggestions: foundTour ? [
          { label: '📅 Выбрать даты', query: `Выбрать даты для ${foundTour.title}` },
          { label: '🏨 Отели', query: `Лучшие отели в ${foundTour.title}` },
          { label: '💰 Итоговая цена', query: `Рассчитать стоимость ${foundTour.title}` }
        ] : []
      };
      setMessages((prev) => [...prev, botMsg]);
      scrollToBottom();
    }, 1500);
  };

  React.useEffect(() => {
    if (initialQuery && isFirstRender.current) {
      isFirstRender.current = false;
      handleSend(initialQuery, true);
    }
  }, [initialQuery]);

  React.useEffect(() => {
    if (!isGenerating) scrollToBottom();
  }, [messages, isTyping]);

  const aiAvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop";

  return (
    <div className="flex flex-col min-h-full bg-white relative w-full max-w-full">
      {isGenerating && (
        <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="w-20 h-20 relative mb-6">
            <div className="absolute inset-0 border-4 border-brand-sky/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-brand-sky">
              <Icon name="Sparkles" size={32} className="animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-black text-brand-indigo animate-bounce uppercase tracking-tighter">Магия AI...</h2>
        </div>
      )}

      <div className="flex-1 flex flex-col relative w-full max-w-full min-w-0">
        <div className="flex-1 flex w-full max-w-full min-w-0">
          <div className={`flex flex-col bg-white flex-1 transition-all w-full max-w-full min-w-0 ${activeTab === 'chat' ? 'flex' : 'hidden'}`}>
            <div className="px-4 py-4 md:pt-10 md:pb-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 z-10 w-full">
              <div className="flex items-center gap-3">
                <button onClick={onBack} className="md:hidden p-2 -ml-2 text-slate-400">
                  <Icon name="ArrowLeft" size={24} />
                </button>
                <div className="w-11 h-11 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 border-2 border-brand-sky/20 p-0.5 shadow-sm">
                  <img src={aiAvatarUrl} className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <h3 className="text-sm md:text-xl font-black text-brand-indigo leading-tight uppercase tracking-tight">AI Тревел-гид</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">онлайн</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-6 bg-slate-50/30 w-full pb-10">
              {messages.map((msg, index) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col w-full ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex flex-col max-w-[95%] md:max-w-[80%] ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm text-sm md:text-lg leading-relaxed break-words w-full ${
                      msg.type === 'user'
                        ? 'bg-brand-indigo text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-slate-200/50'
                    }`}>
                      <div className="whitespace-pre-wrap font-medium">
                        {msg.text.split('**').map((part, i) =>
                          i % 2 === 1 ? (
                            <b key={i} className={`font-black ${msg.type === 'user' ? 'text-brand-sky' : 'text-brand-indigo'}`}>{part}</b>
                          ) : ( part )
                        )}
                      </div>

                      {/* КАРТОЧКА ТУРА В ЧАТЕ */}
                      {msg.tour && (
                        <div className="mt-6 group cursor-pointer">
                          <div className="relative aspect-[4/5] md:aspect-[16/10] rounded-[3rem] overflow-hidden mb-4 shadow-2xl isolation-auto">
                            <img
                              src={msg.tour.img}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 rounded-[3rem] will-change-transform"
                              alt={msg.tour.title}
                            />
                            {/* Layla-style enhanced gradient underlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-[3rem]"></div>

                            <div className="absolute top-6 left-6">
                              <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg">
                                <Icon name={msg.tour.weatherIcon} size={14} /> {msg.tour.temp}
                              </div>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8 text-left">
                              <h3 className="text-2xl md:text-4xl font-black text-white mb-1 tracking-tight leading-none drop-shadow-2xl">
                                {msg.tour.title}
                              </h3>
                              <div className="flex items-center gap-2 text-white/90 font-bold text-xs uppercase tracking-widest mb-4 drop-shadow-lg">
                                <Icon name="MapPin" size={14} />
                                <span>{msg.tour.routeCount} маршрутов</span>
                              </div>
                              <div className="bg-brand-amber text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest inline-block shadow-xl">
                                {msg.tour.total}
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed px-4 text-left">
                            {msg.tour.desc}
                          </p>
                        </div>
                      )}
                    </div>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 animate-in slide-in-from-left-4 duration-500">
                        {msg.suggestions.map((s, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => handleSend(s.query)} 
                            className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs md:text-sm font-bold text-slate-500 hover:border-brand-sky/30 hover:text-brand-indigo hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3 w-full animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-brand-sky/20">
                    <img src={aiAvatarUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white text-slate-800 border border-slate-100 p-4 md:px-6 md:py-4 rounded-[1.5rem] md:rounded-[2rem] rounded-tl-none shadow-sm shadow-slate-200/50 flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 bg-brand-sky/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-brand-sky/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-brand-sky/60 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}

              <div ref={lastMsgRef} className="h-4" />
            </div>

            <div className="bg-white border-t border-slate-100 shrink-0 sticky bottom-[50px] md:bottom-0 md:static z-20 w-full">
              <div className="absolute top-full left-0 right-0 h-20 bg-white md:hidden -z-10" />
              <div className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar px-4 py-4 md:px-8 bg-white w-full border-b border-slate-50">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleSend(action.query)} 
                    className="flex items-center gap-2 px-5 py-2.5 md:px-4 md:py-2 bg-white border border-slate-100 hover:border-brand-sky/30 hover:bg-slate-50 rounded-xl whitespace-nowrap transition-all active:scale-95 group shadow-sm shrink-0 md:shrink"
                  >
                    <span className="text-base md:text-base">{action.icon}</span>
                    <span className="text-xs md:text-[13px] font-black text-slate-500 group-hover:text-brand-indigo transition-colors uppercase tracking-wider">{action.label}</span>
                  </button>
                ))}
              </div>
              <div className="p-4 md:p-8 w-full bg-white">
                <div className="max-w-4xl mx-auto relative flex items-center w-full">
                  <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Напишите сообщение..." className="w-full pl-6 pr-28 py-4 md:py-6 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border-none focus:ring-4 focus:ring-brand-sky/10 outline-none text-slate-800 font-bold text-sm md:text-xl transition-all placeholder:text-slate-400 placeholder:font-normal" />
                  <div className="absolute right-2 flex items-center space-x-1">
                    <button className="p-3 text-slate-400 hover:text-brand-sky active:scale-90 transition-all"><Icon name="Mic" size={26} /></button>
                    <button onClick={() => handleSend()} className="p-3 bg-brand-sky text-white rounded-2xl hover:bg-brand-sky/90 transition-all shadow-lg active:scale-90"><Icon name="Send" size={24} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex-1 bg-slate-50/50 overflow-y-auto custom-scrollbar transition-all ${activeTab === 'routes' ? 'block' : 'hidden'}`}>
            <div className="p-4 md:p-10 w-full max-w-5xl mx-auto">
              <div className="mb-8 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 w-full">
                <h3 className="text-xl md:text-2xl font-black text-brand-indigo mb-6 flex items-center gap-2">Популярные маршруты</h3>
                <div className="relative group mb-6">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-sky transition-colors"><Icon name="MapPin" size={20} /></div>
                  <input type="text" defaultValue="Москва" className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-sky/20 outline-none text-slate-800 font-bold text-base md:text-lg transition-all" />
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
                  {['Все', 'Активный', 'Пляж', 'Романтика'].map(f => (
                    <button
                      key={f}
                      onClick={() => setSelectedFilter(f)}
                      className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 ${
                        selectedFilter === f 
                          ? 'bg-brand-sky text-white shadow-xl shadow-brand-sky/20' 
                          : 'bg-white text-slate-500 border border-slate-100 hover:border-brand-sky/30 hover:text-brand-indigo hover:bg-slate-50'
                      }`}
                    >
                      {f === 'Активный' && <span className="text-sm">⚡</span>}
                      {f === 'Пляж' && <span className="text-sm">🌴</span>}
                      {f === 'Романтика' && <span className="text-sm">🎈</span>}
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-24 md:pb-10">
                {ALL_TOURS.filter(tour => selectedFilter === 'Все' || tour.tags.some(tag => tag.includes(selectedFilter))).map((res, i) => (
                  <div
                    key={i}
                    onClick={() => handleSearch(res.title)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] md:aspect-[16/10] rounded-[3rem] overflow-hidden mb-6 shadow-2xl isolation-auto">
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

                      <div className="absolute bottom-8 left-8 right-8 text-left">
                        <h3 className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight leading-none drop-shadow-2xl">
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
          </div>
        </div>
      </div>
    </div>
  );
}
