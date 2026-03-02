function ProfilePage({ onBack, onChat, user, setUser, onEditRoute, activeRoute }) {
  const [activeTab, setActiveTab] = React.useState("routes");
  const [sheetHeight, setSheetHeight] = React.useState(60);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [tempName, setTempName] = React.useState(user?.name || "");
  const fileInputRef = React.useRef(null);
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
    if (newHeight > 90) newHeight = 90;
    setSheetHeight(newHeight);
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveName = () => {
    setUser({ ...user, name: tempName });
    setIsEditingName(false);
  };

 const handleToggleActive = (routeId) => {
   setUser((prevUser) => ({
     ...prevUser,
     savedRoutes: prevUser.savedRoutes.map((route) =>
       route.id === routeId ? { ...route, isActive: !route.isActive } : { ...route, isActive: false }
     ),
   }));
 };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* ПРОФИЛЬ */}
        <div
          className="absolute bottom-0 w-full md:static md:h-full flex flex-col bg-white z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] md:shadow-none rounded-t-[2.5rem] md:rounded-none transition-height duration-75 ease-out"
          style={{
            height: window.innerWidth < 768 ? `${sheetHeight}%` : "100%",
          }}
        >
          {/* Зона перетаскивания и Навигация (Мобильная) */}
          <div
            className="w-full pt-3 shrink-0 bg-white rounded-t-[2.5rem] md:rounded-none border-b border-slate-50 md:cursor-default cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2 md:hidden"></div>

            <div className="px-4 md:px-6 py-4 flex items-center justify-between pointer-events-none">
              <h1 className="text-xl font-black text-brand-indigo">
                Мой профиль
              </h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col pb-28 md:pb-10">
            <div className="flex flex-col items-center md:items-start mb-10">
              <div
                onClick={handleAvatarClick}
                className="w-24 h-24 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm overflow-hidden cursor-pointer group relative"
              >
                {user?.photo ? (
                  <img src={user.photo} className="w-full h-full object-cover" />
                ) : (
                  <Icon name="User" size={40} className="text-slate-300" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="Check" size={24} className="text-white" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={handleSaveName}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                      className="text-xl font-bold text-brand-indigo border-b-2 border-brand-sky outline-none bg-transparent min-w-[150px]"
                    />
                    <button onClick={handleSaveName} className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm active:scale-90 transition-transform">
                      <Icon name="Check" size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-brand-indigo">{user?.name}</h2>
                    <button
                      onClick={() => {
                        setTempName(user?.name || "");
                        setIsEditingName(true);
                      }}
                      className="p-2.5 bg-brand-sky/10 text-brand-sky hover:bg-brand-sky/20 rounded-xl transition-all active:scale-90"
                      aria-label="Редактировать имя"
                    >
                      <Icon name="Pencil" size={16} />
                    </button>
                  </>
                )}
              </div>

              <p className="text-sm text-slate-400 font-medium">
                Путешественник с 2026 года
              </p>
            </div>

            <div className="flex p-1 bg-slate-50 rounded-2xl mb-6">
              <button
                onClick={() => setActiveTab("routes")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "routes" ? "bg-white text-brand-indigo shadow-sm" : "text-slate-400"}`}
              >
                Активно
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "saved" ? "bg-white text-brand-indigo shadow-sm" : "text-slate-400"}`}
              >
                Сохранено
              </button>
            </div>

            <div className="flex-1 min-h-[200px] bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-y-auto p-4">
              {activeTab === "routes" ? (
                // "Активно" tab: show a map-like display of the active route
                                <ActiveRouteDisplay activeRoute={activeRoute} onEditRoute={onEditRoute} />
              ) : (
                // "Сохранено" tab: show all saved routes with toggle
                (user.savedRoutes && user.savedRoutes.length > 0) ? (
                  <div className="space-y-4 w-full">
                    {user.savedRoutes.map((route) => (
                      <div key={route.id} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-brand-sky/10 text-brand-sky flex items-center justify-center">
                              <Icon name="Map" size={16} />
                            </div>
                            <span className="font-bold text-brand-indigo">Маршрут от {route.date}</span>
                          </div>
                          <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{route.points?.length || 0} точек</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {route.points?.slice(0, 3).map((p, idx) => (
                            <span key={idx} className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 border border-slate-100 truncate max-w-[120px]">
                              {p.title}
                            </span>
                          ))}
                          {route.points?.length > 3 && (
                            <span className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-400">
                              +{route.points.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Бюджет</span>
                            <span className="font-black text-brand-indigo">{route.budget?.toLocaleString("ru-RU")} ₽</span>
                          </div>
                          <div className="flex items-center gap-4">
                                                      <label className="flex items-center gap-2 cursor-pointer ml-4">
                                                        <span className="text-sm font-bold text-slate-600">Активен</span>
                                                        <div className="relative">
                                                          <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={route.isActive}
                                                            onChange={() => handleToggleActive(route.id)}
                                                          />
                                                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-sky"></div>
                                                        </div>
                                                      </label>
                                                      <button onClick={() => onEditRoute(route)} className="p-2.5 bg-brand-sky/10 text-brand-sky hover:bg-brand-sky/20 rounded-xl transition-all active:scale-90">
                                                                                    <Icon name="Pencil" size={16} />
                                                                                  </button>
                                                    </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-300 text-sm font-medium italic">
                    Список пуст
                  </div>
                )
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
