import React from 'react';
import { KPI_DATA } from '../constants';
import { RatingLevel, EvaluationState, KPIItem } from '../types';
import { ShieldCheck, AlertCircle, XCircle, Pencil, Activity, Wrench, Users, FileBarChart } from 'lucide-react';

interface InputSectionProps {
  ratings: EvaluationState;
  onRate: (id: string, level: RatingLevel, score: number) => void;
  onNoteChange: (id: string, note: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ ratings, onRate, onNoteChange }) => {
  
  // Helper to get icon and style based on category ID
  const getCategoryConfig = (id: string) => {
    switch (id) {
      case 'cat_1': // Vận hành
        return {
          icon: <Activity size={22} strokeWidth={2.5} />,
          color: "text-indigo-500 dark:text-indigo-400",
          bg: "bg-indigo-50 dark:bg-indigo-900/10",
          border: "border-indigo-100 dark:border-indigo-500/20",
          accent: "bg-indigo-500"
        };
      case 'cat_2': // An toàn
        return {
          icon: <ShieldCheck size={22} strokeWidth={2.5} />,
          color: "text-emerald-500 dark:text-emerald-400",
          bg: "bg-emerald-50 dark:bg-emerald-900/10",
          border: "border-emerald-100 dark:border-emerald-500/20",
          accent: "bg-emerald-500"
        };
      case 'cat_3': // Thiết bị
        return {
          icon: <Wrench size={22} strokeWidth={2.5} />,
          color: "text-amber-500 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-900/10",
          border: "border-amber-100 dark:border-amber-500/20",
          accent: "bg-amber-500"
        };
      case 'cat_4': // Nhân sự
        return {
          icon: <Users size={22} strokeWidth={2.5} />,
          color: "text-rose-500 dark:text-rose-400",
          bg: "bg-rose-50 dark:bg-rose-900/10",
          border: "border-rose-100 dark:border-rose-500/20",
          accent: "bg-rose-500"
        };
      case 'cat_5': // Báo cáo
        return {
          icon: <FileBarChart size={22} strokeWidth={2.5} />,
          color: "text-purple-500 dark:text-purple-400",
          bg: "bg-purple-50 dark:bg-purple-900/10",
          border: "border-purple-100 dark:border-purple-500/20",
          accent: "bg-purple-500"
        };
      default:
        return {
          icon: <Activity size={22} strokeWidth={2.5} />,
          color: "text-slate-500",
          bg: "bg-slate-100",
          border: "border-slate-100",
          accent: "bg-slate-500"
        };
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {KPI_DATA.map((category) => {
        const config = getCategoryConfig(category.id);
        
        return (
          <div 
            key={category.id} 
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[24px] shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden scroll-mt-24 transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
          >
            
            {/* Category Header Frame - Clean & Minimal */}
            <div className="px-5 py-5 md:px-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 group">
               <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${config.bg} ${config.color} transition-transform duration-300 group-hover:scale-105 shrink-0`}>
                  {config.icon}
               </div>
               <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight transition-colors duration-300">
                      {category.name.replace(/^\d+\.\s*/, '')}
                  </h3>
                  {/* Subtle progress indicator line instead of heavy pill */}
                  <div className={`h-1 w-16 rounded-full mt-2 opacity-30 ${config.accent} group-hover:w-24 transition-all duration-500`}></div>
               </div>
            </div>
            
            {/* Items Container Body */}
            <div className="p-4 md:p-6 lg:p-8 bg-slate-50/30 dark:bg-slate-950/20">
              <div className="space-y-4">
                {category.items.map((item) => (
                  <KPIItemRow 
                    key={item.id} 
                    item={item} 
                    currentRating={ratings[item.id]} 
                    onRate={onRate}
                    onNoteChange={onNoteChange}
                    categoryColorClass={config.color}
                    accentColor={config.accent}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface KPIItemRowProps {
  item: KPIItem;
  currentRating: EvaluationState[string] | undefined;
  onRate: (id: string, level: RatingLevel, score: number) => void;
  onNoteChange: (id: string, note: string) => void;
  categoryColorClass?: string;
  accentColor?: string;
}

const KPIItemRow: React.FC<KPIItemRowProps> = ({ item, currentRating, onRate, onNoteChange, categoryColorClass, accentColor }) => {
  
  const handleSelect = (level: RatingLevel) => {
    const criteria = item.criteria[level];
    const score = Math.round(item.maxPoints * criteria.scorePercent * 100) / 100;
    onRate(item.id, level, score);
  };

  // Determine styles based on rating
  let containerClassName = `p-5 relative group bg-white dark:bg-[#0f172a] rounded-2xl border transition-all duration-300 ease-out `;
  let leftBorderClass = "hidden"; // Default hidden
  
  if (currentRating?.level === RatingLevel.GOOD) {
    containerClassName += "border-emerald-500/30 shadow-sm shadow-emerald-500/5 dark:shadow-emerald-900/10 hover:border-emerald-400 z-10";
    leftBorderClass = "bg-emerald-500";
  } else if (currentRating?.level === RatingLevel.AVERAGE) {
    containerClassName += "border-blue-500/30 shadow-sm shadow-blue-500/5 dark:shadow-blue-900/10 hover:border-blue-400 z-10";
    leftBorderClass = "bg-blue-500";
  } else if (currentRating?.level === RatingLevel.WEAK) {
    containerClassName += "border-rose-500/30 shadow-sm shadow-rose-500/5 dark:shadow-rose-900/10 hover:border-rose-400 z-10";
    leftBorderClass = "bg-rose-500";
  } else {
    // Not rated state
    containerClassName += "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md hover:-translate-y-0.5";
  }

  return (
    <div className={containerClassName}>
      
      {/* Active Indicator Line - Slimmer */}
      {currentRating && (
         <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${leftBorderClass} animate-in fade-in duration-500`}></div>
      )}

      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
         
         {/* LEFT: Content & Checklist */}
         <div className="flex-1">
            <div className="flex items-start gap-4 mb-2">
               <div className={`flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-bold shrink-0 mt-0.5 transition-colors duration-300 ${
                 currentRating 
                 ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                 : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
               }`}>
                  {item.code}
               </div>
               <div className="w-full">
                  <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                      <h4 className={`text-base font-bold leading-tight transition-colors duration-300 ${
                        currentRating ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'
                      }`}>
                          {item.name}
                      </h4>
                      <div className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          Trọng số: <span className="text-slate-900 dark:text-slate-200 ml-1">{item.maxPoints}Đ</span>
                      </div>
                  </div>
                  
                  {/* Checklist Points - Integrated visually */}
                  <div className="mt-3 pl-1 space-y-1.5">
                      {item.checklist?.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 group/item cursor-default opacity-80 hover:opacity-100 transition-opacity">
                            <div className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ${accentColor ? 'group-hover/item:' + accentColor : ''}`}></div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                              {point}
                            </span>
                        </div>
                      ))}
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT: Actions */}
         <div className="w-full xl:w-[360px] shrink-0 flex flex-col gap-4 border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-800 pt-4 xl:pt-0 xl:pl-6 justify-center">
            
            {/* Rating Buttons - Refined */}
            <div className="grid grid-cols-3 gap-2">
               {/* Good Button */}
               <button
                  onClick={() => handleSelect(RatingLevel.GOOD)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border transition-all duration-200 active:scale-95 ${
                     currentRating?.level === RatingLevel.GOOD
                     ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20 ring-1 ring-emerald-500/30 ring-offset-1 dark:ring-offset-slate-900'
                     : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
                  }`}
               >
                  <ShieldCheck size={18} className={`transition-transform duration-300 ${currentRating?.level === RatingLevel.GOOD ? 'scale-105' : ''}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Tốt</span>
               </button>

               {/* Average Button */}
               <button
                  onClick={() => handleSelect(RatingLevel.AVERAGE)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border transition-all duration-200 active:scale-95 ${
                     currentRating?.level === RatingLevel.AVERAGE
                     ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-500/30 ring-offset-1 dark:ring-offset-slate-900'
                     : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                  }`}
               >
                  <AlertCircle size={18} className={`transition-transform duration-300 ${currentRating?.level === RatingLevel.AVERAGE ? 'scale-105' : ''}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Khá</span>
               </button>

               {/* Weak Button */}
               <button
                  onClick={() => handleSelect(RatingLevel.WEAK)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border transition-all duration-200 active:scale-95 ${
                     currentRating?.level === RatingLevel.WEAK
                     ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/20 ring-1 ring-rose-500/30 ring-offset-1 dark:ring-offset-slate-900'
                     : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-rose-500/50 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10'
                  }`}
               >
                  <XCircle size={18} className={`transition-transform duration-300 ${currentRating?.level === RatingLevel.WEAK ? 'scale-105' : ''}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Yếu</span>
               </button>
            </div>

            {/* Note Input - Minimal */}
            <div className="relative group/note">
               <Pencil size={12} className="absolute top-3.5 left-3.5 text-slate-400 group-focus-within/note:text-indigo-500 transition-colors" />
               <textarea
                  value={currentRating?.notes || ''}
                  onChange={(e) => onNoteChange(item.id, e.target.value)}
                  placeholder="Ghi chú thêm..."
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none resize-none h-[40px] min-h-[40px] transition-all hover:border-slate-300 dark:hover:border-slate-700 focus:shadow-sm"
               />
            </div>
         </div>
      </div>
    </div>
  );
};

export default InputSection;