
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import InputSection from './components/InputSection';
import ResultsPanel from './components/ResultsPanel';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import { EvaluationState, RatingLevel } from './types';
import { KPI_DATA } from './constants';
import { User, Building2, Briefcase, CreditCard, Calendar, Upload, Printer, X, Flame } from 'lucide-react';
import DashboardReport from './components/DashboardReport';
import { authService, UserAccount } from './services/authService';

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
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{name: string, role: string, avatar?: string} | undefined>(undefined);

  // Preview and Print states
  const [showPreview, setShowPreview] = useState(false);
  
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

  // Check for existing session on mount
  useEffect(() => {
    const sessionUser = authService.getCurrentUser();
    if (sessionUser) {
      handleLoginSuccess(sessionUser);
    }
  }, []);

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

  const handleLoginSuccess = (user: UserAccount) => {
    setIsLoggedIn(true);
    setCurrentUser({ 
      name: user.fullName, 
      role: user.role,
      avatar: user.avatar 
    });
    
    // Note: We no longer auto-fill employeeInfo here based on user request.
    // The form starts empty (or with placeholders).
  };

  const handleLogout = () => {
    authService.logout(); // Clear session from local storage
    setIsLoggedIn(false);
    setCurrentUser(undefined);
    setEmployeeInfo(prev => ({
        ...prev,
        name: '',
        id: '',
        position: '',
        department: ''
    }));
    setRatings({}); // Clear current ratings on logout
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
      const lowerName = cat.name.toLowerCase();

      // Clean short names for UI/Charts
      if (lowerName.includes("vận hành")) shortName = "Vận hành";
      else if (lowerName.includes("an toàn")) shortName = "An toàn";
      else if (lowerName.includes("thiết bị")) shortName = "Thiết bị";
      else if (lowerName.includes("nhân sự")) shortName = "Nhân sự";
      else if (lowerName.includes("báo cáo")) shortName = "Báo cáo";

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
            ranking = "Đạt Yêu Cầu"; // Updated to match legend
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

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 print:bg-white transition-colors duration-500 overflow-hidden">
      
      {/* Harmonious Background Mesh - Only show when logged in to keep login screen pure */}
      {isLoggedIn && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none no-print">
           <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[800px] bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[10000ms]"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[1000px] h-[800px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
        </div>
      )}

      {/* Header - Only visible when logged in */}
      {isLoggedIn && (
        <Header 
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          isLoggedIn={isLoggedIn}
          userProfile={currentUser}
          onLoginClick={() => {}} // Not needed when logged in
          onLogoutClick={handleLogout}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative z-10 w-full max-w-[1920px] mx-auto overflow-hidden flex flex-col">
        {!isLoggedIn ? (
          // --- AUTH PAGE (Not Logged In) ---
          <LandingPage onLoginSuccess={handleLoginSuccess} />
        ) : (
          // --- DASHBOARD (Logged In) ---
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
                    {/* Changed Grid to 3 columns for 2-row layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      
                      {/* 1. Name */}
                      <div className="space-y-1.5 group/input">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-500 transition-colors">
                              Họ và tên nhân viên
                            </label>
                            <div className="relative transition-all duration-300 transform group-focus-within/input:-translate-y-0.5">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
                                <User size={16} />
                              </div>
                              <input 
                                type="text" 
                                placeholder="Nhập họ tên đầy đủ..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400/70 shadow-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                                value={employeeInfo.name}
                                onChange={(e) => handleInfoChange('name', e.target.value)}
                              />
                            </div>
                      </div>

                      {/* 2. ID */}
                      <div className="space-y-1.5 group/input">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-500 transition-colors">
                              Mã nhân viên
                            </label>
                            <div className="relative transition-all duration-300 transform group-focus-within/input:-translate-y-0.5">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
                                <CreditCard size={16} />
                              </div>
                              <input 
                                type="text" 
                                placeholder="VD: NV-001"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400/70 shadow-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                                value={employeeInfo.id}
                                onChange={(e) => handleInfoChange('id', e.target.value)}
                              />
                            </div>
                      </div>

                      {/* 3. Position */}
                      <div className="space-y-1.5 group/input">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-500 transition-colors">
                              Chức vụ
                            </label>
                            <div className="relative transition-all duration-300 transform group-focus-within/input:-translate-y-0.5">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
                                <Briefcase size={16} />
                              </div>
                              <input 
                                type="text" 
                                placeholder="VD: Trưởng ca / Nhân viên"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400/70 shadow-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                                value={employeeInfo.position}
                                onChange={(e) => handleInfoChange('position', e.target.value)}
                              />
                            </div>
                      </div>

                      {/* 4. Department */}
                      <div className="space-y-1.5 group/input">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-500 transition-colors">
                              Bộ phận / Phòng ban
                            </label>
                            <div className="relative transition-all duration-300 transform group-focus-within/input:-translate-y-0.5">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
                                <Building2 size={16} />
                              </div>
                              <input 
                                type="text" 
                                placeholder="VD: Vận Hành Lò Hơi"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400/70 shadow-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                                value={employeeInfo.department}
                                onChange={(e) => handleInfoChange('department', e.target.value)}
                              />
                            </div>
                      </div>

                      {/* 5. Report Month */}
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

                      {/* 6. Report Date */}
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

                {/* --- RATING STANDARDS SECTION --- */}
                <div className="bg-slate-900 dark:bg-slate-900/80 rounded-[24px] p-6 md:p-8 shadow-lg border border-slate-800 relative overflow-hidden">
                    {/* Decorative background similar to screenshot style */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-rose-500 opacity-30"></div>
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400">
                           <Flame size={20} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide">Tiêu chuẩn xếp loại</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
                        {/* Card 1: Excellent */}
                        <div className="bg-slate-950/40 border border-emerald-500/20 rounded-xl p-5 hover:border-emerald-500/40 transition-all hover:bg-slate-900/60 group">
                             <div className="flex justify-between items-center mb-4">
                                 <h4 className="text-emerald-400 font-extrabold uppercase text-sm tracking-wide">Xuất sắc</h4>
                                 <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900 text-white border border-slate-700 shadow-sm">90 - 100%</span>
                             </div>
                             <p className="text-xs text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                                Hoàn thành xuất sắc nhiệm vụ, không xảy ra sự cố, tuân thủ tuyệt đối quy trình.
                             </p>
                        </div>
                        
                        {/* Card 2: Average */}
                         <div className="bg-slate-950/40 border border-blue-500/20 rounded-xl p-5 hover:border-blue-500/40 transition-all hover:bg-slate-900/60 group">
                             <div className="flex justify-between items-center mb-4">
                                 <h4 className="text-blue-400 font-extrabold uppercase text-sm tracking-wide">Đạt yêu cầu</h4>
                                 <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900 text-white border border-slate-700 shadow-sm">70 - 90%</span>
                             </div>
                             <p className="text-xs text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                                Hoàn thành nhiệm vụ được giao, còn sai sót nhỏ nhưng đã khắc phục kịp thời.
                             </p>
                        </div>

                        {/* Card 3: Weak */}
                         <div className="bg-slate-950/40 border border-rose-500/20 rounded-xl p-5 hover:border-rose-500/40 transition-all hover:bg-slate-900/60 group">
                             <div className="flex justify-between items-center mb-4">
                                 <h4 className="text-rose-400 font-extrabold uppercase text-sm tracking-wide">Không đạt</h4>
                                 <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900 text-white border border-slate-700 shadow-sm">&lt; 70%</span>
                             </div>
                             <p className="text-xs text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                                Vi phạm quy trình vận hành, để xảy ra sự cố nghiêm trọng hoặc thiếu trách nhiệm.
                             </p>
                        </div>
                    </div>
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
        )}
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
