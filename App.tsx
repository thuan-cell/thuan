import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import InputSection from './components/InputSection';
import ResultsPanel from './components/ResultsPanel';
import { EvaluationState, RatingLevel } from './types';
import { KPI_DATA } from './constants';
import { Sun, Moon, User, Building2, Briefcase, CreditCard, Calendar, Upload, Image as ImageIcon, Flame, Info, Printer, Download, X, Loader2, Factory, ChevronRight } from 'lucide-react';
import DashboardReport from './components/DashboardReport';

export interface EmployeeInfo {
  name: string;
  id: string;
  position: string;
  department: string;
  reportDate: string;
}

function App() {
  const [ratings, setRatings] = useState<EvaluationState>({});
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  
  // Initialize dark mode state based on what was set in index.html (localStorage or default true)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });
  
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  
  // Preview and Print states
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    name: '',
    id: '',
    position: '',
    department: '',
    reportDate: new Date().toISOString().slice(0, 10)
  });

  // Refs for date pickers
  const monthInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleRate = useCallback((id: string, level: RatingLevel, score: number) => {
    setRatings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        level,
        actualScore: score,
        notes: prev[id]?.notes || ''
      }
    }));
  }, []);

  const handleNoteChange = useCallback((id: string, note: string) => {
    setRatings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        notes: note
      }
    }));
  }, []);

  const handleInfoChange = (field: keyof EmployeeInfo, value: string) => {
    setEmployeeInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- CALCULATION LOGIC (Lifted from ResultsPanel) ---
  const { categoryScores, totalScore, maxTotalScore, percent, ranking } = useMemo(() => {
    let totalScore = 0;
    let maxTotalScore = 0;
    
    const categoryScores = KPI_DATA.map(cat => {
      let catScore = 0;
      let catMax = 0;
      cat.items.forEach(item => {
        catMax += item.maxPoints;
        if (ratings[item.id]) {
          catScore += ratings[item.id].actualScore;
        }
      });
      
      catScore = Math.round(catScore * 100) / 100;
      totalScore += catScore;
      maxTotalScore += catMax;
      
      const percentage = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;
      
      let shortName = cat.name.split('.')[1]?.trim() || cat.name;

      // Clean short names for UI/Charts
      if (shortName.includes("VẬN HÀNH")) shortName = "Vận hành";
      else if (shortName.includes("AN TOÀN")) shortName = "An toàn";
      else if (shortName.includes("THIẾT BỊ")) shortName = "Thiết bị";
      else if (shortName.includes("NHÂN SỰ")) shortName = "Nhân sự";
      else if (shortName.includes("BÁO CÁO")) shortName = "Báo cáo";

      return { 
        id: cat.id,
        name: cat.name, 
        shortName: shortName,
        score: catScore, 
        max: catMax, 
        percentage: percentage
      };
    });

    totalScore = Math.round(totalScore * 100) / 100;
    const percent = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
    
    let ranking = "---";
    
    if (percent > 0) {
        if (percent >= 90) {
            ranking = "Xuất Sắc";
        } else if (percent >= 70) {
            ranking = "Đạt";
        } else {
            ranking = "Không Đạt";
        }
    }

    return { categoryScores, totalScore, maxTotalScore, percent, ranking };
  }, [ratings]);

  // --- Printing and PDF Logic ---
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('printable-dashboard');
    if (!element) {
      alert("Không tìm thấy nội dung báo cáo.");
      return;
    }

    setIsDownloadingPdf(true);

    const opt = {
      margin: 0, 
      filename: `KPI_Bao_Cao_${selectedMonth}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true, 
        logging: false,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const wasHidden = element.classList.contains('hidden');
    if (wasHidden) {
      element.classList.remove('hidden');
      element.classList.add('block');
    }

    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => {
        setIsDownloadingPdf(false);
        if (wasHidden) {
          element.classList.add('hidden');
          element.classList.remove('block');
        }
      }).catch((err: any) => {
        console.error("PDF error:", err);
        setIsDownloadingPdf(false);
        if (wasHidden) {
          element.classList.add('hidden');
          element.classList.remove('block');
        }
      });
    } else {
      alert("Đang tải thư viện PDF, vui lòng đợi...");
      setIsDownloadingPdf(false);
      if (wasHidden) {
          element.classList.add('hidden');
          element.classList.remove('block');
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 print:bg-white transition-colors duration-500 overflow-hidden">
      
      {/* Harmonious Background Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none no-print">
         <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[800px] bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[10000ms]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[1000px] h-[800px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
      </div>

      {/* Elegant Header */}
      <header className="shrink-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/50 no-print supports-[backdrop-filter]:bg-white/40 sticky top-0 transition-all duration-300">
        <div className="max-w-[1920px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
               <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-md group-hover:bg-indigo-500/30 transition duration-500"></div>
               <div className="relative bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                 <Factory size={20} strokeWidth={2} />
               </div>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                KPI System <span className="font-light text-slate-400 mx-1">|</span> <span className="text-indigo-600 dark:text-indigo-400">Boiler Performance</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-amber-500 dark:hover:text-amber-400 transition-all shadow-sm hover:shadow-md"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Full Height Flex Container */}
      <main className="flex-1 relative z-10 w-full max-w-[1920px] mx-auto overflow-hidden">
        <div className="flex flex-col xl:flex-row h-full">
          
          {/* Left Column: Form & Inputs - Scrollable Independently */}
          <div className="flex-1 order-2 xl:order-1 no-print min-w-0 h-full overflow-y-auto scroll-smooth custom-scrollbar">
            {/* WIDENED CONTAINER */}
            <div className="p-4 md:p-8 lg:p-10 space-y-6 max-w-[1600px] mx-auto">
              
              {/* Employee Info Card - HARMONIZED */}
              <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[24px] shadow-sm hover:shadow-md border border-slate-200/60 dark:border-slate-800/60 overflow-hidden transition-all duration-500">
                {/* Subtle Accent Line */}
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50"></div>

                <div className="px-6 md:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                       <User size={22} strokeWidth={2} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Thông tin nhân sự</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Cập nhật hồ sơ đánh giá định kỳ</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      id="logo-upload" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleLogoUpload}
                    />
                    <label 
                      htmlFor="logo-upload" 
                      className="cursor-pointer group/btn flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2.5 rounded-xl transition-all border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {companyLogo ? (
                        <>
                          <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                             <img src={companyLogo} alt="Logo" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-emerald-600 dark:text-emerald-400">Đã tải Logo</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                          <span>Tải Logo</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="px-6 md:px-8 pb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    
                    {/* Input Field Component - Clean & Modern */}
                    {[
                      { label: "Họ và tên nhân viên", icon: <User size={16} />, value: employeeInfo.name, field: 'name', placeholder: "Nhập họ tên đầy đủ..." },
                      { label: "Mã nhân viên", icon: <CreditCard size={16} />, value: employeeInfo.id, field: 'id', placeholder: "VD: NV-001" },
                      { label: "Chức vụ", icon: <Briefcase size={16} />, value: employeeInfo.position, field: 'position', placeholder: "VD: Trưởng ca" },
                      { label: "Bộ phận / Phòng ban", icon: <Building2 size={16} />, value: employeeInfo.department, field: 'department', placeholder: "VD: Kỹ thuật" }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5 group/input">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-500 transition-colors">
                            {item.label}
                          </label>
                          <div className="relative transition-all duration-300 transform group-focus-within/input:-translate-y-0.5">
                             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
                               {item.icon}
                             </div>
                             <input 
                               type="text" 
                               placeholder={item.placeholder}
                               className="w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400/70 shadow-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                               value={item.value}
                               onChange={(e) => handleInfoChange(item.field as any, e.target.value)}
                             />
                          </div>
                      </div>
                    ))}

                    {/* Report Month */}
                    <div className="space-y-1.5 group/input">
                       <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-500 transition-colors">
                         Kỳ đánh giá
                      </label>
                       <div className="relative transition-all duration-300 transform group-focus-within/input:-translate-y-0.5">
                         <div 
                            onClick={() => monthInputRef.current?.showPicker()}
                            className="absolute inset-y-0 left-0 pl-3.5 flex items-center cursor-pointer text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 group-focus-within/input:text-indigo-500 transition-colors z-10"
                         >
                             <Calendar size={16} />
                         </div>
                         <input 
                          ref={monthInputRef}
                          type="month" 
                          className="w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all cursor-pointer"
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Report Date */}
                    <div className="space-y-1.5 group/input">
                       <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-500 transition-colors">
                         Ngày lập
                      </label>
                      <div className="relative transition-all duration-300 transform group-focus-within/input:-translate-y-0.5">
                         <div 
                            onClick={() => dateInputRef.current?.showPicker()}
                            className="absolute inset-y-0 left-0 pl-3.5 flex items-center cursor-pointer text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 group-focus-within/input:text-indigo-500 transition-colors z-10"
                         >
                             <Calendar size={16} />
                         </div>
                         <input 
                          ref={dateInputRef}
                          type="date" 
                          className="w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all cursor-pointer"
                          value={employeeInfo.reportDate}
                          onChange={(e) => handleInfoChange('reportDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Header */}
              <div className="flex items-center gap-4 px-2 pt-2 pb-0">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                   Chi tiết đánh giá
                 </h2>
                 <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800/60"></div>
              </div>
              
              <InputSection 
                ratings={ratings} 
                onRate={handleRate} 
                onNoteChange={handleNoteChange} 
              />

              {/* Ranking Legend - CLEAN & MINIMAL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Xuất sắc", range: "≥ 90%", desc: "Vượt kỳ vọng, không lỗi.", color: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200/60 dark:border-emerald-900/40", bg: "bg-emerald-50/50 dark:bg-emerald-900/10" },
                  { title: "Đạt", range: "70-89%", desc: "Hoàn thành tốt, ít lỗi nhỏ.", color: "text-blue-600 dark:text-blue-400", border: "border-blue-200/60 dark:border-blue-900/40", bg: "bg-blue-50/50 dark:bg-blue-900/10" },
                  { title: "Chưa đạt", range: "< 70%", desc: "Cần cải thiện quy trình.", color: "text-rose-600 dark:text-rose-400", border: "border-rose-200/60 dark:border-rose-900/40", bg: "bg-rose-50/50 dark:bg-rose-900/10" }
                ].map((item, i) => (
                  <div key={i} className={`flex flex-col p-5 rounded-2xl border ${item.border} ${item.bg} backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-sm`}>
                     <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-bold uppercase tracking-wide ${item.color}`}>{item.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/60 dark:bg-black/20 ${item.color}`}>{item.range}</span>
                     </div>
                     <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
              
              {/* Padding at bottom to ensure last element is scrollable into view */}
              <div className="h-12"></div>
            </div>
          </div>

          {/* Right Column: Results & Tools - Sticky Side on Desktop */}
          <div className="w-full xl:w-[440px] 2xl:w-[480px] order-1 xl:order-2 print:hidden flex-shrink-0 xl:h-full flex flex-col p-4 xl:p-6 xl:pl-0 pointer-events-none xl:pointer-events-auto z-20">
             {/* THE FRAME - HARMONIZED */}
             <div className="w-full h-auto xl:h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-[32px] shadow-2xl shadow-indigo-500/10 border border-slate-200/80 dark:border-slate-800/80 flex flex-col relative overflow-hidden pointer-events-auto transition-all duration-500">
                
                {/* Subtle Gradient Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 opacity-80"></div>
                
                {/* Soft Background Glows */}
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                <div className="flex-1 flex flex-col p-6 xl:p-8 relative z-10 overflow-hidden">
                    <ResultsPanel 
                      // Pass calculated props
                      categoryScores={categoryScores}
                      totalScore={totalScore}
                      percent={percent}
                      ranking={ranking}
                      selectedMonth={selectedMonth} 
                      showPreview={showPreview}
                      setShowPreview={setShowPreview}
                      onPrint={handlePrint}
                    />
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Hidden Print/Preview Overlay - MOVED TO ROOT OF APP to avoid transformation clipping */}
      <div 
        id="print-overlay" 
        className={`${showPreview ? "fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md overflow-y-auto p-4 flex justify-center animate-in fade-in duration-300" : "hidden"} print:block print:absolute print:top-0 print:left-0 print:w-full print:h-auto print:bg-white print:p-0 print:m-0 print:z-[100] print:overflow-visible`}
      >
         {/* FLOATING ACTION TOOLBAR - Visible only in Preview Mode */}
         {showPreview && (
            <div className="fixed top-6 right-6 z-[70] flex items-center gap-2 p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl print:hidden animate-in slide-in-from-top-4 duration-500">
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-900 hover:bg-slate-200 text-xs font-bold transition-all active:scale-95 shadow-sm"
                >
                  <Printer size={16} />
                  <span>In Báo Cáo</span>
                </button>
                <div className="w-px h-6 bg-white/20 mx-1"></div>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-lg hover:bg-white/20 text-white transition-all active:scale-95"
                  title="Đóng xem trước"
                >
                  <X size={20} />
                </button>
            </div>
         )}

         <div 
           id="printable-dashboard" 
           className="bg-white shadow-2xl w-[210mm] min-h-[297mm] origin-top transform transition-transform print:transform-none print:shadow-none print:m-0"
         >
            <DashboardReport 
              ratings={ratings}
              selectedMonth={selectedMonth}
              totalScore={totalScore}
              maxTotalScore={maxTotalScore}
              percent={percent}
              ranking={ranking}
              categoryScores={categoryScores}
              employeeInfo={employeeInfo}
              logoUrl={companyLogo}
            />
         </div>
      </div>
      
      {/* Scrollbar styling injected */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.4);
        }
      `}</style>
    </div>
  );
}

export default App;