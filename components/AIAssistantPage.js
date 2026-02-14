function AIAssistantPage({ onBack, onProfile, initialQuery, activeTab, setActiveTab, user }) {
  const [selectedFilter, setSelectedFilter] = React.useState('Все');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [inputText, setInputText] = React.useState('');
  
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

  const [messages, setMessages] = React.useState([
    {
      id: 1,
      type: 'bot',
      text: 'Привет! Я **AI-ассистент** по путешествиям. Расскажите, куда хотите отправиться, и я подберу идеальный маршрут.',
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

  const handleSend = (text) => {
    const message = text || inputText;
    if (!message || !message.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: message };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const foundTour = ALL_TOURS.find(t => t.title === message);
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: foundTour 
          ? `Отличный выбор! Вот детали маршрута **${foundTour.title}**, который я подготовила:`
          : `Это отличный выбор! Я начала подбирать лучшие локации по запросу: **"${message}"**. \n\nСчитаю бюджет и строю оптимальный путь...`,
        tour: foundTour || null
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  React.useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

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
                  <h3 className="text-sm md:text-xl font-black text-brand-indigo leading-tight uppercase tracking-tight">AI Ассистент</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">онлайн</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-6 bg-slate-50/30 w-full">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
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

                      {/* КАРТОЧКА ТУРА: ТОЧНАЯ КОПИЯ ГЛАВНОЙ СТРАНИЦЫ */}
                      {msg.tour && (
                        <div className="mt-6 bg-white rounded-[2rem] p-3 shadow-2xl shadow-slate-300/50 border border-slate-100 flex flex-col transition-all duration-300 relative group cursor-pointer hover:border-brand-sky/30">
                          <div className="absolute top-6 left-6 z-10 flex items-center gap-1.5 bg-rose-500 text-white px-2.5 py-1 rounded-xl text-[10px] font-black shadow-lg shadow-rose-500/30">
                            <Icon name="Map" size={12} className="text-white" />
                            <span>{msg.tour.routeCount}</span>
                          </div>

                          <div className="h-48 md:h-64 rounded-[1.5rem] overflow-hidden relative mb-4">
                            <img src={msg.tour.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute top-3 right-3 flex gap-1">
                              {msg.tour.tags.map((tag) => (
                                <span key={tag} className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm">{tag}</span>
                              ))}
                            </div>
                          </div>

                          <div className="px-2 pb-2 flex-1 flex flex-col text-left">
                            <div className="flex justify-between items-start mb-2 gap-2">
                              <h3 className="font-black text-xl md:text-2xl text-brand-indigo leading-tight group-hover:text-brand-sky transition-colors">{msg.tour.title}</h3>
                              <span className="bg-brand-indigo/5 text-brand-indigo px-2.5 py-1.5 rounded-lg text-sm font-black whitespace-nowrap">{msg.tour.total}</span>
                            </div>
                            <p className="text-sm md:text-base text-slate-500 font-medium mb-6 leading-relaxed">{msg.tour.desc}</p>

                            <div className="mt-auto">
                              <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider"><span>Бюджет тура</span></div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex mb-2.5">
                                <div className="h-full bg-brand-indigo" style={{ width: `${msg.tour.breakdown[0]}%` }}></div>
                                <div className="h-full bg-brand-amber" style={{ width: `${msg.tour.breakdown[1]}%` }}></div>
                                <div className="h-full bg-brand-sky" style={{ width: `${msg.tour.breakdown[2]}%` }}></div>
                              </div>
                              <div className="flex flex-wrap gap-x-2 md:gap-x-3 gap-y-1">
                                <div className="flex items-center gap-1">
                                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-indigo"></div>
                                  <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">Дорога</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-amber"></div>
                                  <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">Отель</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-sky"></div>
                                  <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">Досуг</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border-t border-slate-100 shrink-0 sticky bottom-[64px] md:bottom-0 md:static z-20 w-full">
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-4 md:px-8 bg-white/50 backdrop-blur-sm w-full border-b border-slate-50">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button key={idx} onClick={() => handleSend(action.query)} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-brand-sky/5 border border-slate-100 rounded-xl whitespace-nowrap transition-all active:scale-95 group shadow-sm shrink-0">
                    <span className="text-sm">{action.icon}</span>
                    <span className="text-[10px] font-black text-slate-500 group-hover:text-brand-indigo transition-colors uppercase tracking-wider">{action.label}</span>
                  </button>
                ))}
              </div>
              <div className="p-4 md:p-8 w-full">
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
              <div className="mb-10 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 w-full">
                <h3 className="text-xl md:text-2xl font-black text-brand-indigo mb-6 flex items-center gap-2">Актуальные маршруты</h3>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-sky transition-colors"><Icon name="MapPin" size={20} /></div>
                  <input type="text" defaultValue="Москва" className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-sky/20 outline-none text-slate-800 font-bold text-base md:text-lg transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-24 md:pb-10">
                {ALL_TOURS.map((res, i) => (
                  <div key={i} onClick={() => handleSend(res.title)} className="bg-white rounded-[2rem] p-3 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col transition-all duration-300 relative group cursor-pointer hover:border-brand-sky/30">
                    <div className="absolute top-6 left-6 z-10 flex items-center gap-1.5 bg-rose-500 text-white px-2.5 py-1 rounded-xl text-[10px] font-black shadow-lg shadow-rose-500/30">
                      <Icon name="Map" size={12} className="text-white" />
                      <span>{res.routeCount}</span>
                    </div>
                    <div className="h-48 md:h-64 rounded-[1.5rem] overflow-hidden relative mb-4">
                      <img src={res.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={res.title} />
                      <div className="absolute top-3 right-3 flex gap-1">
                        {res.tags.map((tag) => (
                          <span key={tag} className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="px-2 pb-2 flex-1 flex flex-col text-left">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-black text-xl md:text-2xl text-brand-indigo leading-tight group-hover:text-brand-sky transition-colors">{res.title}</h3>
                        <span className="bg-brand-indigo/5 text-brand-indigo px-2.5 py-1.5 rounded-lg text-sm font-black whitespace-nowrap">{res.total}</span>
                      </div>
                      <p className="text-sm md:text-base text-slate-500 font-medium mb-6 leading-relaxed">{res.desc}</p>
                      <div className="mt-auto">
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider"><span>Бюджет тура</span></div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex mb-2.5">
                          <div className="h-full bg-brand-indigo" style={{ width: `${res.breakdown[0]}%` }}></div>
                          <div className="h-full bg-brand-amber" style={{ width: `${res.breakdown[1]}%` }}></div>
                          <div className="h-full bg-brand-sky" style={{ width: `${res.breakdown[2]}%` }}></div>
                        </div>
                        <div className="flex flex-wrap gap-x-2 md:gap-x-3 gap-y-1">
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-indigo"></div>
                            <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">Дорога</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-amber"></div>
                            <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">Отель</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-sky"></div>
                            <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">Досуг</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
