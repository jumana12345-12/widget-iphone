import React, { useState, useEffect } from 'react';
import { Clock, Pill, Calendar, Heart, Zap, ChevronRight, Droplets, Activity, Moon, Footprints, Check, MapPin } from 'lucide-react';

// إضافة خط IBM Plex Sans Arabic
const fontStyle = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
.font-ibm { font-family: 'IBM Plex Sans Arabic', sans-serif; }
`;

// بيانات وهمية محدثة (سارة ووالدتها)
const mockData = {
  appointments: {
    type: 'appointments',
    // العنوان العاطفي (فوق الزر) - تم حذف "يا" وإضافة "لها"
    emotionalMessage: 'سارة، والدتك تحتاجك تكوني لها سند 🤍',
    // تفاصيل الموعد (توضيح أنه للوالدة)
    title: 'موعد الوالدة: عيادة القلب',
    description: 'موعد والدتك اليوم مع د. هدى العلي',
    cta: 'أنا لها (مساندة)', // تم تعديل النص من مرافقة إلى مساندة
    time: '2025-12-16T18:30:00',
    location: 'مستشفى الملك فيصل التخصصي'
  },
};

// مكون مساعد للعد التنازلي
const CountdownDisplay = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const calculateTimeLeft = () => Math.max(0, new Date(targetTime).getTime() - new Date().getTime());
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  if (timeLeft <= 0) return <span className="text-red-500 text-xs font-bold">الآن!</span>;
  const hours = String(Math.floor(timeLeft / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((timeLeft / 1000 / 60) % 60)).padStart(2, '0');
  // استخدام لون داكن أكثر وضوحاً
  return <span className="text-emerald-700 dark:text-emerald-300 font-ibm text-sm font-bold tracking-widest">{hours}:{minutes}</span>;
};

// ===============================================
// مكون مكدس الويدجت الذكي (Smart Stack Widget)
// ===============================================
const SmartStackWidget = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEscortConfirmed, setIsEscortConfirmed] = useState(false);
  
  const widgets = [data.appointments];

  // تدوير الويدجت (معطل لأنه عنصر واحد)
  useEffect(() => {
    if (widgets.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % widgets.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [widgets.length]);

  const currentWidget = widgets[activeIndex];

  const handleEscortConfirm = (e) => {
    e.stopPropagation();
    setIsEscortConfirmed(true);
    console.log("📢 إشعار للوالدة: سارة أكدت مساندتك 🤍");
  };

  const renderWidgetContent = (widget) => {
    switch (widget.type) {
      case 'appointments':
        if (isEscortConfirmed) {
            return (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in zoom-in duration-300 font-ibm">
                    <div className="bg-emerald-100 dark:bg-emerald-800/50 p-3 rounded-full">
                        <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">تم تأكيد المساندة</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">وصل والدتك إشعار بقدومك 🤍</p>
                    </div>
                </div>
            );
        }

        return (
          <div className="h-full flex flex-col justify-between font-ibm relative">
            
            {/* القسم العلوي: تفاصيل الموعد */}
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2 space-x-reverse">
                         {/* تم إعادة أيقونة التقويم هنا */}
                         <div className="bg-emerald-100 dark:bg-emerald-900/40 p-1.5 rounded-lg">
                            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                         </div>
                         <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                            {widget.title}
                         </h2>
                    </div>
                    <CountdownDisplay targetTime={widget.time} />
                </div>
                
                <div className="mr-8">
                     <p className="text-xs text-gray-500 dark:text-gray-300 leading-snug mb-1">
                        {widget.description}
                    </p>
                    <div className="flex items-center text-[10px] text-gray-400 dark:text-gray-400">
                        <MapPin className="w-3 h-3 ml-1" />
                        {widget.location}
                    </div>
                </div>
            </div>

            {/* القسم السفلي: العبارة العاطفية + الزر */}
            <div className="mt-auto">
                {/* العبارة العاطفية بخط صغير فوق الزر */}
                <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 mb-1.5 font-medium">
                    {widget.emotionalMessage}
                </p>

                {/* زر التفاعل بلون أخضر زمردي */}
                <button 
                    onClick={handleEscortConfirm}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center text-sm"
                >
                    {widget.cta}
                </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div className="flex flex-col items-center space-y-1 font-ibm">
        <div
          className="relative bg-white dark:bg-gray-800 w-full h-[180px] rounded-[22px] shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
          dir="rtl"
        >
          <div className="p-4 h-full transition-opacity duration-500">
            {renderWidgetContent(currentWidget)}
          </div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-opacity duration-300 mt-2">
          {currentWidget.type === 'appointments' && isEscortConfirmed ? 'تم التأكيد' : 'صحتنا'}
        </span>
      </div>
    </>
  );
};

// ===============================================
// مكون إطار الآيفون
// ===============================================
const IPhoneFrame = ({ children, darkMode }) => (
  <div
    className={`
      relative w-[375px] h-[780px] rounded-[55px] shadow-2xl
      bg-black border-[12px] border-black
      p-1 overflow-hidden flex flex-col items-center justify-start
      transition-all duration-500 transform scale-95 md:scale-100 ring-4 ring-gray-300 dark:ring-gray-800
    `}
  >
    <div className={`
      w-full h-full rounded-[45px] overflow-y-auto custom-scrollbar relative
      ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}
    `}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')] bg-cover bg-center opacity-100" />
        <div className={`absolute inset-0 ${darkMode ? 'bg-black/40' : 'bg-white/10'}`} />

      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-20 shadow-sm flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gray-800/50 absolute right-4"></div>
      </div>
      
      <div className="relative z-10 p-5 pt-14 space-y-6 h-full flex flex-col font-ibm">
        {children}
      </div>
    </div>
    
    <div className="absolute left-[-14px] top-[150px] w-[6px] h-[40px] bg-gray-700 rounded-l-lg shadow-sm"></div>
    <div className="absolute left-[-14px] top-[210px] w-[6px] h-[65px] bg-gray-700 rounded-l-lg shadow-sm"></div>
    <div className="absolute left-[-14px] top-[285px] w-[6px] h-[65px] bg-gray-700 rounded-l-lg shadow-sm"></div>
    <div className="absolute right-[-14px] top-[220px] w-[6px] h-[90px] bg-gray-700 rounded-r-lg shadow-sm"></div>
  </div>
);

// ===============================================
// المكون الرئيسي
// ===============================================
export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex flex-col items-center justify-center transition-colors duration-300 font-ibm" dir="rtl">
        <div className="w-full max-w-md flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">ويدجت "سند"</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">محاكاة تجربة مرافقة الوالدين</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-90"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <IPhoneFrame darkMode={darkMode}>
          <div className="flex justify-between items-center text-xs text-white mb-4 font-semibold px-2 tracking-wide opacity-90">
              <span>10:51</span>
              <div className="flex items-center space-x-1.5 space-x-reverse">
                 <Activity className="w-3 h-3" />
                 <span>5G</span>
                 <div className="w-5 h-2.5 bg-white rounded-[2px] relative ml-1">
                     <div className="absolute inset-0 bg-black/20"></div>
                     <div className="absolute top-0 right-0 h-full w-[80%] bg-white"></div>
                 </div>
              </div>
          </div>

          <div className="mb-8 transform transition-all duration-300 hover:scale-[1.02]">
            <SmartStackWidget data={mockData} />
          </div>

          <div className="grid grid-cols-4 gap-x-5 gap-y-7 px-1">
            <div className="flex flex-col items-center space-y-1.5">
                {/* جعل لون التطبيق باهت وشفاف */}
                <div className="w-[60px] h-[60px] bg-emerald-500/30 backdrop-blur-md border border-white/20 rounded-[14px] shadow-sm flex items-center justify-center">
                    {/* تم حذف أيقونة القلب من هنا */}
                </div>
                <span className="text-[11px] text-white font-medium drop-shadow-md">صحتنا</span>
            </div>
            
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-1.5">
                <div className="w-[60px] h-[60px] bg-white/20 backdrop-blur-md rounded-[14px] shadow-sm"></div>
                <span className="text-[11px] text-white font-medium drop-shadow-md">تطبيق</span>
              </div>
            ))}
          </div>

          <div className="mt-auto mb-2">
            <div className="w-full bg-white/20 backdrop-blur-xl rounded-[28px] p-4 flex justify-between items-center px-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-[55px] h-[55px] bg-gradient-to-b from-gray-200/80 to-white/50 rounded-[14px] shadow-sm"></div>
                ))}
            </div>
          </div>
        </IPhoneFrame>
      </div>
    </div>
  );
}
