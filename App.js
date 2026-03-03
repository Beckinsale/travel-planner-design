const { useState, useRef } = React;

const STEPS = [
  {
    id: 1,
    title: 'Задай параметры',
    desc: 'Введи бюджет, город отправления, даты и количество путешественников.',
    icon: 'Target',
  },
  {
    id: 2,
    title: 'Собери маршрут',
    desc: 'Система предложит варианты или ты соберёшь маршрут вручную из точек.',
    icon: 'Sliders',
  },
  {
    id: 3,
    title: 'Визуализируй',
    desc: 'Все точки появятся на интерактивной карте с таймлайном и бюджетом.',
    icon: 'Map',
  },
  { id: 4, title: 'Бронируй', icon: 'Plane' },
];

function LoginModal({ onClose, onLogin }) {
  const [mode, setMode] = useState('login');

  // Блокировка скролла под модальным окном
  React.useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 text-left">
      <div
        className="absolute inset-0 bg-brand-indigo/40 backdrop-blur-sm touch-none"
        onClick={onClose}
      ></div>
      <div
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] overscroll-contain"
        style={{ overscrollBehavior: 'contain' }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-brand-indigo p-2 hover:bg-slate-50 rounded-full z-20"
        >
          <Icon name="Plus" size={24} className="rotate-45" />
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8 md:p-10 pt-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-brand-sky rounded-[2rem] shadow-lg flex items-center justify-center text-white mx-auto mb-6 border-4 border-white">
              <Icon name="User" size={40} />
            </div>
            <h2 className="text-3xl font-black text-brand-indigo uppercase tracking-tight">
              {mode === 'login' ? 'Вход' : 'Создать аккаунт'}
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-2">
              {mode === 'login'
                ? 'Войдите в личный кабинет'
                : 'Присоединяйтесь к нам сегодня'}
            </p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
          >
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                  Как вас зовут?
                </label>
                <input
                  type="text"
                  placeholder="Имя Фамилия"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-sky/20 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                  required
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                Email
              </label>
              <input
                type="email"
                placeholder="example@mail.com"
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-sky/20 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                Пароль
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-sky/20 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-5 bg-brand-amber text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-amber/20 active:scale-[0.98] transition-all mt-4"
            >
              {mode === 'login' ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
            </button>
          </form>
          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-sm font-bold">
              {mode === 'login' ? 'Впервые у нас?' : 'Уже есть аккаунт?'}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="ml-2 text-brand-sky hover:underline"
              >
                {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ activeView, activeTab, onViewChange }) {
  const menuItems = [
    {
      id: 'chat',
      icon: 'MessageSquare',
      label: 'Чат',
      view: 'ai-assistant',
      tab: 'chat',
    },
    { id: 'planner', icon: 'MapPin', label: 'Маршруты', view: 'planner' },
    { id: 'profile', icon: 'User', label: 'Профиль', view: 'profile' },
  ];
  return (
    <div className="hidden md:flex flex-col w-20 bg-white border-r border-slate-100 items-center py-8 space-y-4 shrink-0 z-50 sticky top-16 h-[calc(100vh-64px)]">
      <div className="flex-1 flex flex-col space-y-4 mt-4">
        {menuItems.map((item) => {
          const isActive =
            activeView === item.view &&
            (item.tab ? activeTab === item.tab : true);
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.view, item.tab)}
              className={`p-3 rounded-2xl transition-all relative group ${isActive ? (item.id === 'chat' ? 'bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-400 text-white shadow-lg shadow-purple-500/20' : 'bg-brand-sky text-white shadow-lg shadow-brand-sky/20') : 'text-slate-400 hover:text-brand-indigo hover:bg-slate-50'}`}
            >
              <Icon name={item.icon} size={24} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MobileNav({ activeView, activeTab, onViewChange }) {
  const menuItems = [
    { id: 'home', icon: 'Home', label: 'Главная', view: 'landing' },
    {
      id: 'ai',
      icon: 'MessageSquare',
      label: 'AI Гид',
      view: 'ai-assistant',
      tab: 'chat',
    },
    { id: 'planner', icon: 'MapPin', label: 'Маршруты', view: 'planner' },
    { id: 'profile', icon: 'User', label: 'Профиль', view: 'profile' },
  ];
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 pt-2 pb-6 flex justify-between items-center z-[100] pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] w-full">
      {menuItems.map((item) => {
        const isActive = activeView === item.view;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.view, item.tab)}
            className={`flex flex-col items-center gap-1 transition-all active:scale-90 flex-1 ${isActive ? (item.id === 'ai' ? 'text-purple-600' : 'text-brand-sky') : 'text-slate-400'}`}
          >
            <Icon name={item.icon} size={24} />
            <span
              className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function App() {
  console.log("App: v1.0.1 - Cleaning up handlers");
  const [view, setView] = useState('landing');
  const [scenario, setScenario] = useState('ai');
  const [initialQuery, setInitialQuery] = useState('');
  const [aiRouteContext, setAiRouteContext] = useState(null); // New state for AI route context
  const [activeTab, setActiveTab] = useState('chat');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState({
    name: 'Иван Иванов',
    photo: null,
    savedRoutes: [
      {
        id: 1,
        date: "2026-03-01",
        budget: 3000,
        isActive: true,
        points: [
          { id: 1, title: 'Красная площадь', coords: [55.755864, 37.617698], budget: 0, date: '2026-06-01' },
          { id: 2, title: 'Парк Горького', coords: [55.733974, 37.602598], budget: 1500, date: '2026-06-02' },
        ],
      },
      {
        id: 2,
        date: "2026-02-15",
        budget: 5000,
        isActive: false,
        points: [
          { id: 1, title: 'Эрмитаж', coords: [59.939095, 30.315868], budget: 1000, date: '2026-02-15' },
          { id: 2, title: 'Невский проспект', coords: [59.935493, 30.327376], budget: 500, date: '2026-02-16' },
        ],
      },
    ],
  });

 const activeRoute = React.useMemo(
   () => user.savedRoutes.find((route) => route.isActive),
   [user.savedRoutes]
 );

 const [selectedPredefinedRoute, setSelectedPredefinedRoute] = useState(null);
 const [editingRoute, setEditingRoute] = useState(null); // New state for route being edited
 const [showUserMenu, setShowUserMenu] = useState(false);
 const userMenuRef = useRef(null);

 const handleEditRoute = (route) => {
   setEditingRoute(route);
   setView('planner');
   window.scrollTo(0, 0);
 };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleSaveRoute = (routeData) => {
    setUser(prev => {
      const existingRouteIndex = prev.savedRoutes.findIndex(route => route.id === routeData.id);
      if (existingRouteIndex > -1) {
        const updatedRoutes = [...prev.savedRoutes];
        updatedRoutes[existingRouteIndex] = routeData;
        return {
          ...prev,
          savedRoutes: updatedRoutes
        };
      } else {
        return {
          ...prev,
          savedRoutes: [...(prev.savedRoutes || []), { ...routeData, id: Date.now() }]
        };
      }
    });
    alert('Маршрут сохранен в личном кабинете!');
    setEditingRoute(null); // Clear editing route after saving
  };

  const handleStart = (queryOrRouteContext) => {
    if (typeof queryOrRouteContext === 'string') {
      setInitialQuery(queryOrRouteContext);
      setAiRouteContext(null);
    } else {
      setAiRouteContext(queryOrRouteContext);
      setInitialQuery('');
    }
    setView('ai-assistant');
    setActiveTab('chat');
    window.scrollTo(0, 0);
  };

  const handleNavigate = (newView, tab) => {
    setView(newView);
    if (tab) setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  const handlePredefinedRouteSelect = (predefinedRoute) => {
    console.log("App: Selecting predefined route:", predefinedRoute);
    setSelectedPredefinedRoute(predefinedRoute);
    setView('tour');
    window.scrollTo(0, 0);
  };

  const handleGoToDirections = () => {
    setView("planner");
    setActiveTab("popular");
    window.scrollTo(0, 0);
  };

  const isInternalPage = view !== 'landing' && view !== 'tour';

  return (
    <div className="bg-white min-h-screen">
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => {
            setShowLoginModal(false);
            setView('profile');
          }}
        />
      )}

      {/* FIXED HEADER: HIDDEN ON MOBILE FOR INTERNAL PAGES (PWA STYLE) */}
      <nav
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}
        className={`w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 h-16 flex items-center shadow-sm ${isInternalPage ? 'hidden md:flex' : 'flex'}`}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-full flex justify-between items-center w-full">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setView('landing');
              window.scrollTo(0, 0);
            }}
          >
            <div className="bg-brand-sky text-white p-1.5 rounded-lg">
              <Icon name="Map" size={20} />
            </div>
            <span className="font-bold text-xl text-brand-indigo tracking-tight">
              TripAI
            </span>
          </div>
          
          <div className="flex items-center gap-4 relative">
            {isInternalPage ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 hover:text-brand-indigo hover:bg-slate-100 transition-all border border-slate-100 overflow-hidden shadow-sm"
                >
                  {user.photo ? (
                    <img src={user.photo} className="w-full h-full object-cover" />
                  ) : (
                    <Icon name="User" size={20} />
                  )}
                </button>
                
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-[2rem] border border-slate-100 shadow-2xl z-[2000] py-4 px-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Профиль</p>
                      <p className="text-sm font-bold text-brand-indigo truncate">{user.name}</p>
                    </div>
                    <div className="space-y-1">
                      {[
                        { id: 'landing', label: 'Главная', icon: 'Home' },
                        { id: 'ai-assistant', label: 'AI Гид', icon: 'MessageSquare', tab: 'chat', color: 'bg-purple-600 text-white shadow-purple-500/20 shadow-lg' },
                        { id: 'planner', label: 'Маршруты', icon: 'MapPin' },
                        { id: 'profile', label: 'Личный кабинет', icon: 'User' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            handleNavigate(item.id, item.tab);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${view === item.id ? (item.id === 'ai-assistant' ? 'bg-purple-50 text-purple-600' : 'bg-brand-sky/10 text-brand-sky') : 'text-slate-600 hover:bg-slate-50 hover:text-brand-indigo'}`}
                        >
                          <div className={`p-2 rounded-xl ${item.color ? item.color : (view === item.id ? 'bg-brand-sky text-white' : 'bg-slate-100 text-slate-400')}`}>
                            <Icon name={item.icon} size={16} />
                          </div>
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-50">
                      <button
                        onClick={() => {
                          setView('landing');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-50 transition-all"
                      >
                        <div className="p-2 rounded-xl bg-red-50 text-red-400">
                          <Icon name="Plus" size={16} className="rotate-45" />
                        </div>
                        Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-500 hover:text-brand-indigo hover:border-brand-sky/30 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* PADDING-TOP COMPENSATOR: ONLY IF HEADER IS VISIBLE */}
      <div
        className={`flex justify-center ${isInternalPage ? 'md:pt-16 pt-0' : 'pt-16'}`}
      >
        <div
          className={`flex w-full ${isInternalPage ? 'max-w-[1104px]' : ''}`}
        >
          {isInternalPage && (
            <Sidebar
              activeView={view}
              activeTab={activeTab}
              onViewChange={handleNavigate}
            />
          )}

          <main
            className={`flex-1 flex flex-col relative w-full min-w-0 ${isInternalPage ? 'bg-white max-w-5xl md:border-x border-slate-100 min-h-screen' : ''}`}
          >
            {view === 'landing' && (
              <LandingPage
                scenario={scenario}
                setScenario={setScenario}
                onStart={handleStart}
                onTourSelect={handlePredefinedRouteSelect}
                onGoToDirections={handleGoToDirections}
              />
            )}
            {view === 'tour' && (
              <div className="flex-1 w-full">
                <TourPage
                  predefinedRoute={selectedPredefinedRoute}
                  onBack={() => setView('landing')}
                  onStartChat={handleStart}
                />
              </div>
            )}
            {view === 'planner' && (
              <div className="w-full flex-1 pb-20 md:pb-0">
                <PlannerPage
                  onBack={() => setView('landing')}
                  onChatWithAI={handleStart}
                  onTourSelect={handlePredefinedRouteSelect}
                  onSave={handleSaveRoute}
                  editingRoute={editingRoute}
                  activeRoute={activeRoute}
                  initialTab={activeTab}
                />
              </div>
            )}
            {view === 'recommendations' && (
              <div className="flex-1 w-full pb-20 md:pb-0">
                <RecommendationsPage onBack={() => setView('landing')} />
              </div>
            )}
            {view === 'ai-assistant' && (
              <div className="flex-1 w-full min-h-full md:min-h-screen">
                <AIAssistantPage
                  onBack={() => setView('landing')}
                  onProfile={() => setView('profile')}
                  initialQuery={initialQuery}
                  aiRouteContext={aiRouteContext} // Pass the route context to AIAssistantPage
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  user={user}
                />
              </div>
            )}
            {view === 'profile' && (
              <div className="flex-1 w-full min-h-full md:min-h-screen">
                <ProfilePage
                  onBack={() => setView('landing')}
                  onChat={() => handleNavigate('ai-assistant', 'chat')}
                  user={user}
                  setUser={setUser}
                  onEditRoute={handleEditRoute}
                  activeRoute={activeRoute}
                />
              </div>
            )}
          </main>
        </div>

        {isInternalPage && (
          <MobileNav
            activeView={view}
            activeTab={activeTab}
            onViewChange={handleNavigate}
          />
        )}
      </div>

      {/* FOOTER: Only Landing or Desktop Internal */}
      <footer
        className={`border-t border-slate-100 bg-white py-12 z-20 ${isInternalPage ? 'hidden md:block' : ''}`}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-8 w-full">
          <div className="flex items-center gap-3">
                        <div className="bg-brand-indigo text-white p-2 rounded-xl">
                          <Icon name="Map" size={24} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-xl text-brand-indigo leading-none">
                            TripAI
                          </span>
              <span className="text-[10px] text-slate-400 mt-2 font-medium leading-none uppercase tracking-widest">
                AI-powered trip planning
              </span>
            </div>
          </div>
          
                    <div className="flex flex-col items-center md:items-start gap-3">
            <a
              href="mailto:feedback@tripai.com"
              className="flex items-center gap-2 text-slate-600 hover:text-brand-sky transition-all font-bold text-sm"
            >
              <Icon name="Mail" size={18} />
              feedback@tripai.com
            </a>
            <a
              href="https://github.com/trip-plan-AI/travel-planner"
              target="_blank"
              className="flex items-center gap-2 text-slate-600 hover:text-brand-sky transition-all font-bold text-sm"
            >
              <Icon name="Github" size={18} />
              github.com/trip-plan-AI/travel-planner
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
