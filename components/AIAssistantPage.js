function AIAssistantPage({
  onBack,
  onProfile,
  initialQuery,
  aiRouteContext, // New prop for AI route context
  activeTab,
  setActiveTab,
  user,
}) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [inputText, setInputText] = React.useState('');
  const scrollContainerRef = React.useRef(null);
  const isFirstRender = React.useRef(true);

  const scrollToBottom = (behavior = 'auto') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: behavior,
        });
      }, 50);
    }
  };

  const ALL_TOURS = [
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
      title: 'Алтай: Золотые Горы',
      desc: 'Дикая природа, бирюзовая Катунь и бескрайние степи.',
      total: '55 000 ₽',
      img: 'https://images.pexels.com/photos/10103738/pexels-photo-10103738.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['⚡ Активный', 'РФ'],
      routeCount: '2.8к',
      temp: '+8°',
      weatherIcon: 'Sun',
    },
    {
      id: 3,
      title: 'Байкал: Ледяная Сказка',
      desc: 'Самое глубокое озеро планеты с чистейшим прозрачным льдом.',
      total: '65 000 ₽',
      img: 'https://images.pexels.com/photos/9344421/pexels-photo-9344421.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['❄️ Зима', 'РФ'],
      routeCount: '3.1к',
      temp: '-15°',
      weatherIcon: 'Cloud',
    },
    {
      id: 4,
      title: 'Камчатка: Вулканы',
      desc: 'Путешествие на край света к огнедышащим горам и океану.',
      total: '115 000 ₽',
      img: 'https://images.pexels.com/photos/20120288/pexels-photo-20120288.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['⛰️ Экстрим', 'РФ'],
      routeCount: '1.5к',
      temp: '+5°',
      weatherIcon: 'Wind',
    },
  ];

  const [messages, setMessages] = React.useState(() => {
    if (aiRouteContext) {
      const routePointsText = aiRouteContext.points.map(p => `- ${p.title} (${p.date || 'без даты'}, ${p.budget}₽)`).join('\n');
      const initialBotMessage = `Привет! Я вижу, ты хочешь отредактировать маршрут.\n\nТекущий маршрут включает:\n${routePointsText}\n\nОбщий бюджет: **${aiRouteContext.budget}₽**.\n\nЧто бы ты хотел изменить?`;
      return [
        {
          id: 1,
          type: 'bot',
          text: initialBotMessage,
        },
      ];
    } else {
      return [
        {
          id: 1,
          type: 'bot',
          text: 'Привет! Куда отправимся? Я могу подобрать оптимальный маршрут прямо из вашего города.',
        },
      ];
    }
  });

  const QUICK_ACTIONS = [
    {
      icon: '🏔️',
      label: 'Алтай',
      query: 'Составь маршрут по Алтаю на 7 дней',
    },
    {
      icon: '💰',
      label: 'Бюджет',
      query: 'Какой бюджет нужен для поездки на Байкал?',
    },
    {
      icon: '🔥',
      label: 'Хиты РФ',
      query: 'Какие направления в России сейчас самые популярные?',
    },
    {
      icon: '❄️',
      label: 'Байкал',
      query: 'Что посмотреть на Байкале зимой?',
    },
    { icon: '🌋', label: 'Камчатка', query: 'Хочу на Камчатку, с чего начать?' },
    {
      icon: '📸',
      label: 'Места',
      query: 'Главные достопримечательности в Сочи',
    },
  ];

  const handleSend = (text, isMagic = false) => {
    const message = text || inputText;
    if (!message || !message.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: message };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    if (isMagic) setIsGenerating(true);
    else setIsTyping(true);

    scrollToBottom('smooth');

    setTimeout(() => {
      setIsGenerating(false);
      setIsTyping(false);
      const foundTour = ALL_TOURS.find((t) => t.title === message);

      const defaultSuggestions = [
        { label: 'Алтай', query: QUICK_ACTIONS[0].query },
        { label: 'Байкал', query: QUICK_ACTIONS[3].query },
        { label: 'Камчатка', query: QUICK_ACTIONS[4].query },
      ];

      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: foundTour
          ? `Отличный выбор! Вот детали маршрута **${foundTour.title}**, который я подготовила:`
          : `Это отличный выбор! Я начала подбирать лучшие локации по запросу: **"${message}"**. \n\nСчитаю бюджет и строю оптимальный путь...`,
        tour: foundTour || null,
        suggestions: foundTour
          ? [
              {
                label: 'Выбрать даты',
                query: `Выбрать даты для ${foundTour.title}`,
              },
              { label: 'Отели', query: `Лучшие отели в ${foundTour.title}` },
              {
                label: 'Итоговая цена',
                query: `Рассчитать стоимость ${foundTour.title}`,
              },
            ]
          : defaultSuggestions,
      };
      setMessages((prev) => [...prev, botMsg]);
      scrollToBottom('smooth');
    }, 1500);
  };

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialQuery && typeof initialQuery === 'string') {
        handleSend(initialQuery, true);
      } else if (aiRouteContext) {
        // If we have aiRouteContext, the initial message is already set in useState, just scroll
        scrollToBottom("smooth");
      }
    }
  }, [initialQuery, aiRouteContext]);

  React.useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isTyping]);

  // const aiAvatarUrl = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2000&auto=format&fit=crop';
  const aiAvatarUrl =
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop';

  return (
    <div className="flex flex-col h-screen md:h-full bg-white relative w-full max-w-full overflow-hidden">
      {isGenerating && (
        <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="w-20 h-20 relative mb-6">
            <div className="absolute inset-0 border-4 border-brand-sky/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-brand-sky">
              <Icon name="Sparkles" size={32} className="animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-black text-brand-indigo animate-bounce uppercase tracking-tighter">
            Магия AI...
          </h2>
        </div>
      )}

      {/* Header (Fixed Height) */}
      <div className="px-4 py-4 md:pt-10 md:pb-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 z-10 w-full">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 border-2 border-brand-sky/20 p-0.5 shadow-sm">
            <img
              src={aiAvatarUrl}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h3 className="text-sm md:text-xl font-black text-brand-indigo leading-tight tracking-tight">
              AI Гид
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">
                онлайн
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Scrollable Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-6 bg-slate-50/30 w-full"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col w-full ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`flex flex-col max-w-[95%] md:max-w-[80%] ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm text-sm md:text-lg leading-relaxed break-words w-full ${
                  msg.type === 'user'
                    ? 'bg-brand-indigo text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-slate-200/50'
                }`}
              >
                <div className="whitespace-pre-wrap font-medium">
                  {msg.text.split('**').map((part, i) =>
                    i % 2 === 1 ? (
                      <b
                        key={i}
                        className={`font-black ${msg.type === 'user' ? 'text-brand-sky' : 'text-brand-indigo'}`}
                      >
                        {part}
                      </b>
                    ) : (
                      part
                    ),
                  )}
                </div>

                {msg.tour && (
                  <div className="mt-6 group cursor-pointer">
                    <div className="relative aspect-[4/5] md:aspect-[16/10] rounded-[3rem] overflow-hidden mb-4 shadow-2xl isolation-auto">
                      <img
                        src={msg.tour.img}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 rounded-[3rem]"
                        alt={msg.tour.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-[3rem]"></div>
                      <div className="absolute top-6 left-6">
                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg">
                          <Icon name={msg.tour.weatherIcon} size={14} />{' '}
                          {msg.tour.temp}
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 text-left">
                        <h3 className="text-2xl md:text-4xl font-black text-white mb-1 tracking-tight leading-none drop-shadow-2xl">
                          {msg.tour.title}
                        </h3>

                                                <div className="flex items-center gap-2 text-white/90 font-bold text-xs uppercase tracking-widest mb-4 drop-shadow-lg">
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
                <div className="flex flex-wrap gap-2 mt-3 mb-2 animate-in slide-in-from-left-4 duration-500">
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
            <div className="bg-white text-slate-800 border border-slate-100 p-4 md:px-6 md:py-4 rounded-[1.5rem] md:rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 bg-brand-sky/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-brand-sky/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-brand-sky/60 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div className="h-10 shrink-0" />
      </div>

      {/* Input Area (Pinned to Viewport Bottom) */}
      <div className="bg-white border-t border-slate-100 shrink-0 pb-[80px] md:pb-0 z-20 w-full shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="relative">
          <div className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto no-scrollbar px-4 py-4 md:px-8 bg-white w-full border-b border-slate-50">
            {QUICK_ACTIONS.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(action.query)}
                className="px-5 py-2.5 bg-white border border-slate-100 hover:border-brand-sky/30 hover:bg-slate-50 rounded-full whitespace-nowrap transition-all active:scale-95 shadow-sm shrink-0 text-xs font-black text-slate-500 hover:text-brand-indigo uppercase tracking-widest flex items-center gap-1.5"
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
            <div className="w-12 shrink-0 md:hidden"></div>
          </div>
          <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none md:hidden z-10"></div>
        </div>
        <div className="p-4 md:p-8 w-full bg-white">
          <div className="max-w-4xl mx-auto relative flex items-center w-full">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Напишите сообщение..."
              className="w-full pl-6 pr-28 py-4 md:py-6 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border-none focus:ring-4 focus:ring-brand-sky/10 outline-none text-slate-800 font-bold text-sm md:text-xl transition-all placeholder:text-slate-400 placeholder:font-normal"
            />
            <div className="absolute right-2 flex items-center space-x-1">
              <button className="p-3 text-slate-400 hover:text-brand-sky active:scale-90 transition-all">
                <Icon name="Mic" size={26} />
              </button>
              <button
                onClick={() => handleSend()}
                className="p-3 bg-brand-sky text-white rounded-2xl hover:bg-brand-sky/90 transition-all shadow-lg active:scale-90"
              >
                <Icon name="Send" size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
