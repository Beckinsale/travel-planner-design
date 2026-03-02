function TourPage({ tour, onBack, onStartChat }) {
  if (!tour) return null;

  // Расширенные данные для туров (в реальности это пришло бы из API)
  const tourDetails = {
    1: {
      // Сочи
      gallery: [
        'https://images.unsplash.com/photo-1515861461225-1488dfdaf0a8?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540339832862-47452993c66e?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=2070&auto=format&fit=crop',
      ],
      fullDesc:
        'Откройте для себя магию контрастов в самом сердце российского Юга. Сочи — это место, где заснеженные пики Кавказских гор встречаются с лазурными водами Черного моря. В этом туре вы пройдете по живописным тропам Красной Поляны, вдохнете свежий горный воздух и насладитесь закатами на Имеретинской набережной. Вас ждут прогулки по реликтовым лесам, подъем на вершину Роза Пик и вечерний релакс в спа-комплексах с видом на горы.',
      highlights: [
        'Подъем на высоту 2320м',
        'Прогулка по каньону Псахо',
        'Вечернее шоу фонтанов',
        'Дегустация местной кухни',
      ],
    },
    2: {
      // Алтай
      gallery: [
        'https://images.pexels.com/photos/10103738/pexels-photo-10103738.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/20120286/pexels-photo-20120286.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/10103723/pexels-photo-10103723.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/10103720/pexels-photo-10103720.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      fullDesc:
        'Алтай — это место силы, где природа сохранилась в своем первозданном виде. Вас ждут бирюзовые воды реки Катунь, величественные горы и перевалы Чуйского тракта. Мы пройдем по самым красивым точкам Горного Алтая, увидим Гейзерное озеро и посетим долину Чулышман. Это путешествие для тех, кто ищет уединения с природой и хочет почувствовать настоящую свободу вдали от городской суеты.',
      highlights: [
        'Чуйский тракт',
        'Сплав по Катуни',
        'Гейзерное озеро',
        'Перевал Кату-Ярык',
      ],
    },
    3: {
      // Байкал
      gallery: [
        'https://images.pexels.com/photos/9344421/pexels-photo-9344421.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/11832049/pexels-photo-11832049.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/13593452/pexels-photo-13593452.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/10103730/pexels-photo-10103730.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      fullDesc:
        'Зимний Байкал — это бесконечная ледяная пустыня с самыми невероятными узорами, которые только может создать природа. Вы увидите знаменитые байкальские пузырьки, огромные торосы и кристально чистые ледяные пещеры. В программе — катание на коньках по самому большому катку мира, поездка на хивусе (катере на воздушной подушке) и знакомство с традициями шаманизма на острове Ольхон.',
      highlights: [
        'Лед острова Ольхон',
        'Пузырьки в метане',
        'Поездка на хивусе',
        'Бурятская кухня',
      ],
    },
    4: {
      // Камчатка
      gallery: [
        'https://images.pexels.com/photos/20120288/pexels-photo-20120288.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/13593453/pexels-photo-13593453.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/13593456/pexels-photo-13593456.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/13593455/pexels-photo-13593455.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      fullDesc:
        'Камчатка — земля льда и пламени на самом краю России. Здесь вы почувствуете дыхание Земли, стоя на краю кратера действующего вулкана. Мы отправимся к подножию Авачинского и Корякского вулканов, прогуляемся по черному песку Халактырского пляжа на берегу Тихого океана и искупаемся в горячих термальных источниках. Это суровое, но невероятно притягательное место для настоящих исследователей.',
      highlights: [
        'Восхождение на вулкан',
        'Тихий океан',
        'Долина Гейзеров',
        'Морская прогулка',
      ],
    },
  };

  const details = tourDetails[tour.id] || {
    gallery: [tour.img],
    fullDesc: tour.desc,
    highlights: ['Интересные локации', 'Продуманный маршрут', 'Местная кухня'],
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Navbar Overlay */}
      <div className="fixed top-0 left-0 right-0 z-[110] px-4 md:px-8 py-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-indigo shadow-xl hover:scale-105 transition-all"
        >
          <Icon name="ArrowLeft" size={24} />
        </button>
        <button
          onClick={() => onStartChat(tour.title)}
          className="px-6 py-3 bg-brand-sky text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-sky/20 hover:scale-105 active:scale-95 transition-all"
        >
          Хочу так же
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <img
          src={tour.img}
          className="w-full h-full object-cover animate-slow-zoom"
          alt={tour.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-12 left-0 right-0 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {tour.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1.5 bg-brand-amber text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight mb-4 drop-shadow-2xl">
              {tour.title}
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-white font-bold">
                <Icon name="Calendar" size={20} />
                <span>5-7 дней</span>
              </div>
              <div className="flex items-center gap-2 text-white font-bold">
                <Icon name="Users" size={20} />
                <span>от 2 чел.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black text-brand-indigo mb-8 uppercase tracking-tight">
              О путешествии
            </h2>
            <p className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed mb-12">
              {details.fullDesc}
            </p>

            <h3 className="text-2xl font-black text-brand-indigo mb-6 uppercase tracking-tight">
              Галерея
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-12">
              {details.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-3xl overflow-hidden shadow-lg group"
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={`Gallery ${idx}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 sticky top-32">
              <div className="mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Стоимость тура
                </span>
                <div className="text-4xl font-black text-brand-indigo">
                  {tour.total}
                </div>
                <span className="text-sm font-bold text-slate-400">
                  за человека
                </span>
              </div>

              <div className="space-y-6 mb-10">
                <h4 className="text-sm font-black text-brand-indigo uppercase tracking-widest border-b border-slate-200 pb-2">
                  Что включено:
                </h4>
                <ul className="space-y-4">
                  {details.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-slate-600 font-bold"
                    >
                      <div className="mt-1 bg-emerald-500 rounded-full p-1 shrink-0">
                        <Icon name="Check" size={12} className="text-white" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() =>
                  onStartChat(`Собери маршрут как в туре "${tour.title}"`)
                }
                className="w-full py-5 bg-brand-amber text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-amber/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Забронировать
              </button>

              <p className="text-center text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-tighter">
                Есть вопросы?{' '}
                <span
                  className="text-brand-sky cursor-pointer"
                  onClick={() =>
                    onStartChat(`Расскажи подробнее про тур "${tour.title}"`)
                  }
                >
                  Спроси AI
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
