
import React from 'react';
import { Eye, Zap, Activity, ShieldCheck, Wrench, Users } from 'lucide-react';

interface CategoryScore {
  id: string;
  name: string;
  shortName: string;
  score: number;
  max: number;
  percentage: number;
}

interface ResultsPanelProps {
  categoryScores: CategoryScore[];
  totalScore: number;
  percent: number;
  ranking: string;
  selectedMonth: string;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  onPrint: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  categoryScores,
  totalScore,
  percent,
  ranking,
  selectedMonth, 
  showPreview,
  setShowPreview,
  onPrint
}) => {
  
  let rankingColor = "text-slate-400";
  let rankingGradient = "from-slate-400 to-slate-500";
  let rankingBg = "bg-slate-100 dark:bg-slate-800";
  
  if (percent > 0) {
      if (percent >= 90) {
          rankingColor = "text-emerald-500 dark:text-emerald-400";
          rankingGradient = "from-emerald-400 to-emerald-500";
          rankingBg = "bg-emerald-50 dark:bg-emerald-900/20";
      } else if (percent >= 70) {
          rankingColor = "text-blue-500 dark:text-blue-400";
          rankingGradient = "from-blue-400 to-indigo-500";
          rankingBg = "bg-blue-50 dark:bg-blue-900/20";
      } else {
          rankingColor = "text-rose-500 dark:text-rose-400";
          rankingGradient = "from-rose-400 to-rose-500";
          rankingBg = "bg-rose-50 dark:bg-rose-900/20";
      }
  }

  // Circular Progress Calculation
  // Reduced radius for compactness
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Helper to get icon and style based on shortName (matching InputSection)
  const getCategoryStyle = (shortName: string) => {
    switch (shortName) {
      case "Vận hành":
        return {
           icon: <Activity size={18} strokeWidth={2.5} />,
           bg: "bg-indigo-50 dark:bg-indigo-900/20",
           text: "text-indigo-500 dark:text-indigo-400",
           border: "border-indigo-100 dark:border-indigo-500/20",
           bar: "bg-indigo-500"
        };
      case "An toàn":
        return {
           icon: <ShieldCheck size={18} strokeWidth={2.5} />,
           bg: "bg-emerald-50 dark:bg-emerald-900/20",
           text: "text-emerald-500 dark:text-emerald-400",
           border: "border-emerald-100 dark:border-emerald-500/20",
           bar: "bg-emerald-500"
        };
      case "Thiết bị":
        return {
           icon: <Wrench size={18} strokeWidth={2.5} />,
           bg: "bg-amber-50 dark:bg-amber-900/20",
           text: "text-amber-500 dark:text-amber-400",
           border: "border-amber-100 dark:border-amber-500/20",
           bar: "bg-amber-500"
        };
      case "Nhân sự":
        return {
           icon: <Users size={18} strokeWidth={2.5} />,
           bg: "bg-rose-50 dark:bg-rose-900/20",
           text: "text-rose-500 dark:text-rose-400",
           border: "border-rose-100 dark:border-rose-500/20",
           bar: "bg-rose-500"
        };
      default:
        return {
           icon: <Activity size={18} strokeWidth={2.5} />,
           bg: "bg-slate-50 dark:bg-slate-800",
           text: "text-slate-500",
           border: "border-slate-100 dark:border-slate-700",
           bar: "bg-slate-500"
        };
    }
  }

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${showPreview ? 'opacity-0 pointer-events-none' : 'opacity-100'} print:hidden`}>
        
        {/* Header - Clean */}
        <div className="flex items-center justify-between shrink-0 mb-4">
             <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                     <Zap size={18} strokeWidth={2.5} />
                 </div>
                 <div>
                     <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider leading-none">Kết Quả</h3>
                     <p className="text-[10px] font-semibold text-slate-400 mt-1">Tháng {selectedMonth.split('-').reverse().join('/')}</p>
                 </div>
             </div>
        </div>

        {/* CONTENT WRAPPER */}
        <div className="flex-1 flex flex-col justify-evenly min-h-0">
            
            {/* 1. HERO CIRCLE SCORE (Harmonized) */}
            <div className="flex flex-col items-center justify-center relative py-2">
                
                <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-slate-100 dark:text-slate-800"
                        />
                        {/* Foreground Circle */}
                        <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="url(#gradient)"
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={percent >= 90 ? '#34d399' : percent >= 70 ? '#60a5fa' : '#fb7185'} />
                            <stop offset="100%" stopColor={percent >= 90 ? '#10b981' : percent >= 70 ? '#3b82f6' : '#f43f5e'} />
                        </linearGradient>
                        </defs>
                    </svg>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-slate-800 dark:text-white tracking-tighter">
                            {totalScore}
                        </span>
                        <div className="text-[10px] text-slate-400 font-medium -mt-1 mb-2">/ 100 điểm</div>
                        
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${rankingColor} ${rankingBg} border-current/10`}>
                            {ranking}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. CATEGORY BREAKDOWN (Clean List) */}
            <div className="flex flex-col gap-3.5 px-1">
                {categoryScores.map((cat, idx) => {
                    const style = getCategoryStyle(cat.shortName);
                    return (
                        <div key={cat.id} className="group flex items-center gap-3">
                            {/* Icon Box */}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${style.bg} ${style.border} ${style.text}`}>
                                {style.icon}
                            </div>
                            
                            {/* Bar & Text */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase truncate leading-normal py-0.5">
                                        {cat.shortName}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-800 dark:text-white">
                                        {cat.score}<span className="text-[9px] text-slate-400 font-medium ml-0.5">/{cat.max}</span>
                                    </span>
                                </div>
                                {/* Modern Slim Bar */}
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-700 ease-out opacity-80 group-hover:opacity-100 ${style.bar}`}
                                        style={{ width: `${cat.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* 3. ACTION BUTTON (Harmonized) */}
        <div className="shrink-0 mt-4">
           <button 
              onClick={() => setShowPreview(true)}
              className="w-full h-11 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white shadow-lg shadow-slate-900/10 dark:shadow-indigo-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
           >
              <Eye size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Xem Báo Cáo</span>
           </button>
        </div>
    </div>
  );
};

export default ResultsPanel;
