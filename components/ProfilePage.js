function ProfilePage({ onBack, onChat, user, setUser }) {
  const [activeTab, setActiveTab] = React.useState('routes');
  const [sheetHeight, setSheetHeight] = React.useState(60);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [tempName, setTempName] = React.useState(user?.name || '');
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

  return (
    <div className="flex flex-col min-h-full bg-white relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* КАРТА (ФОН) */}
        <div className="absolute inset-0 h-full md:relative md:order-2 md:flex-1 border-l border-slate-100 bg-slate-50 z-0 overflow-hidden group">
          <div className="absolute inset-0 flex items-start md:items-center justify-center pt-[10vh] md:pt-0 pointer-events-none px-4">
            <div className="text-center transform transition-transform group-hover:scale-105 pointer-events-auto">
              <div className="w-14 h-14 bg-brand-sky text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce border-4 border-white">
                <Icon name="Map" size={28} />
              </div>
              <h3 className="text-lg md:text-2xl font-black text-slate-400 uppercase tracking-[0.2em] select-none text-center">
                КАРТА ПРОФИЛЯ
              </h3>
              <p className="text-xs md:text-sm text-slate-400 mt-2 font-medium max-w-[280px] mx-auto text-center leading-relaxed">
                История ваших перемещений и локации
              </p>
            </div>
          </div>
        </div>

        {/* ШТОРКА ПРОФИЛЯ */}
        <div
          className="absolute bottom-0 w-full md:static md:h-full md:w-[500px] md:order-1 flex flex-col bg-white z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] md:shadow-none rounded-t-[2.5rem] md:rounded-none transition-height duration-75 ease-out"
          style={{
            height: window.innerWidth < 768 ? `${sheetHeight}%` : 'auto',
          }}
        >
          {/* Зона перетаскивания и Навигация (Мобильная) */}
          <div className="w-full pt-3 shrink-0 bg-white rounded-t-[2.5rem] md:rounded-none border-b border-slate-50">
            <div
              className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2 md:hidden cursor-grab active:cursor-grabbing touch-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            ></div>

            <div className="px-4 md:px-6 py-4 flex items-center justify-between">
              <h1 className="text-xl font-black text-brand-indigo">
                Мой профиль
              </h1>

              <button
                onClick={onBack}
                className="text-rose-500 hover:text-rose-600 flex items-center gap-1 text-sm font-bold transition-colors"
              >
                Выход
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col">
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
                  <Icon name="Plus" size={24} className="text-white" />
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
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      className="text-xl font-bold text-brand-indigo border-b-2 border-brand-sky outline-none bg-transparent min-w-[150px]"
                    />
                    <button onClick={handleSaveName} className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm active:scale-90 transition-transform">
                      <Icon name="Plus" size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-brand-indigo">{user?.name}</h2>
                    <button 
                      onClick={() => {
                        setTempName(user?.name || '');
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
                onClick={() => setActiveTab('routes')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'routes' ? 'bg-white text-brand-indigo shadow-sm' : 'text-slate-400'}`}
              >
                Маршруты
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'saved' ? 'bg-white text-brand-indigo shadow-sm' : 'text-slate-400'}`}
              >
                Сохраненное
              </button>
            </div>

            <div className="flex-1 min-h-[200px] bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden flex items-center justify-center">
              <div className="text-slate-300 text-sm font-medium italic">
                {activeTab === 'routes'
                  ? 'Нет активных маршрутов'
                  : 'Список пуст'}
              </div>
            </div>

            <button className="mt-8 w-full py-4 bg-brand-amber text-white rounded-2xl font-bold shadow-lg shadow-brand-amber/20 active:scale-95 transition-all">
              НОВОЕ ПУТЕШЕСТВИЕ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
