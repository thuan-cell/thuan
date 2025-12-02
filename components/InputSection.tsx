
import React from 'react';
import { KPI_DATA } from '../constants';
import { RatingLevel, EvaluationState, KPIItem } from '../types';
import { CheckCircle, ShieldCheck, AlertCircle, XCircle, Pencil, Activity, Wrench, Users, FileBarChart } from 'lucide-react';

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
    <div className="space-y-6 pb-10">
      {KPI_DATA.map((category) => {
        const config = getCategoryConfig(category.id);
        
        return (
          <div 
            key={category.id} 
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[24px] shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden scroll-mt-24 transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
          >
            
            {/* Category Header Frame - Clean & Minimal */}
            <div className="px-5 py-4 md:px-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 group">
               <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${config.bg} ${config.color} transition-transform duration-300 group-hover:scale-105 shrink-0`}>
                  {config.icon}
               </div>
               <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-tight transition-colors duration-300">
                      {category.name.replace(/^\d+\.\s*/, '')}
                  </h3>
                  {/* Subtle progress indicator line instead of heavy pill */}
                  <div className={`h-0.5 w-12 rounded-full mt-1.5 opacity-30 ${config.accent} group-hover:w-20 transition-all duration-500`}></div>
               </div>
            </div>
            
            {/* Items Container Body */}
            <div className="p-4 md:p-5 bg-slate-50/30 dark:bg-slate-950/20">
              <div className="space-y-3">
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
  let containerClassName = `p-4 relative group bg-white dark:bg-[#0f172a] rounded-2xl border transition-all duration-300 ease-out `;
  let leftBorderClass = "hidden"; 
  
  if (currentRating?.level === RatingLevel.GOOD) {
    containerClassName += "border-emerald-500/30 shadow-sm shadow-emerald-500/5 dark:shadow-emerald-900/10 hover:border-emerald-400 z-10";
    leftBorderClass = "bg-emerald-500";
  } else if (currentRating?.level === RatingLevel.AVERAGE) {
    // Changed to Amber for consistency with new button color
    containerClassName += "border-amber-500/30 shadow-sm shadow-amber-500/5 dark:shadow-amber-900/10 hover:border-amber-400 z-10";
    leftBorderClass = "bg-amber-500";
  } else if (currentRating?.level === RatingLevel.WEAK) {
    containerClassName += "border-rose-500/30 shadow-sm shadow-rose-500/5 dark:shadow-rose-900/10 hover:border-rose-400 z-10";
    leftBorderClass = "bg-rose-500";
  } else {
    // Not rated state
    containerClassName += "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md hover:-translate-y-0.5";
  }

  return (
    <div className={containerClassName}>
      
      {/* Active Indicator Line - Slimmer & Tucked */}
      {currentRating && (
         <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full ${leftBorderClass} animate-in fade-in duration-500`}></div>
      )}

      <div className="flex flex-col xl:flex-row gap-5 lg:gap-6">
         
         {/* LEFT: Content & Checklist */}
         <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-start gap-3 mb-2">
               <div className={`flex items-center justify-center w-7 h-7 rounded-lg border text-[11px] font-bold shrink-0 mt-0.5 transition-colors duration-300 ${
                 currentRating 
                 ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                 : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
               }`}>
                  {item.code}
               </div>
               
               <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-[15px] font-bold leading-tight transition-colors duration-300 ${
                        currentRating ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'
                      }`}>
                          {item.name}
                      </h4>
                      <div className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 text-[10px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {item.maxPoints}đ
                      </div>
                  </div>
                  
                  {/* Checklist Points - Redesigned for beauty & compactness */}
                  <div className="mt-2.5 pt-2.5 border-t border-dashed border-slate-100 dark:border-slate-800/60">
                      <div className="grid gap-1">
                        {item.checklist?.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-2 group/item opacity-80 hover:opacity-100 transition-opacity">
                                <div className={`mt-[5px] w-1 h-1 rounded-full shrink-0 ${accentColor ? 'bg-' + accentColor.replace('bg-', '') : 'bg-slate-300'} opacity-70`}></div>
                                <span className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                                {point}
                                </span>
                            </div>
                        ))}
                      </div>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT: Actions - Optimized Grid */}
         <div className="w-full xl:w-[380px] shrink-0 flex flex-col gap-3 border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-800 pt-3 xl:pt-0 xl:pl-5 justify-center">
            
            {/* Rating Buttons - Compact Height */}
            <div className="grid grid-cols-3 gap-2 h-auto min-h-[100px]">
               {/* Good Button */}
               <button
                  onClick={() => handleSelect(RatingLevel.GOOD)}
                  className={`flex flex-col items-center justify-center text-center gap-1.5 py-2 px-1 rounded-xl border transition-all duration-200 active:scale-95 ${
                     currentRating?.level === RatingLevel.GOOD
                     ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                     : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                  }`}
               >
                  <CheckCircle size={20} className={`transition-transform duration-300 ${currentRating?.level === RatingLevel.GOOD ? 'scale-110 text-white' : 'text-emerald-500'}`} />
                  <div className="flex flex-col gap-1 w-full overflow-hidden justify-center py-0.5">
                      <span className={`text-[11px] font-bold uppercase leading-normal ${currentRating?.level === RatingLevel.GOOD ? 'text-white' : 'text-emerald-600 dark:text-emerald-500'}`}>
                        {item.criteria[RatingLevel.GOOD].label}
                      </span>
                      <span className={`text-[9px] font-medium px-0.5 line-clamp-3 leading-tight whitespace-normal ${
                          currentRating?.level === RatingLevel.GOOD ? 'text-emerald-50' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {item.criteria[RatingLevel.GOOD].description}
                      </span>
                  </div>
               </button>

               {/* Average Button */}
               <button
                  onClick={() => handleSelect(RatingLevel.AVERAGE)}
                  className={`flex flex-col items-center justify-center text-center gap-1.5 py-2 px-1 rounded-xl border transition-all duration-200 active:scale-95 ${
                     currentRating?.level === RatingLevel.AVERAGE
                     ? 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/20'
                     : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-amber-500/30 hover:bg-amber-50/50 dark:hover:bg-amber-900/10'
                  }`}
               >
                  <AlertCircle size={20} className={`transition-transform duration-300 ${currentRating?.level === RatingLevel.AVERAGE ? 'scale-110 text-white' : 'text-amber-500'}`} />
                  <div className="flex flex-col gap-1 w-full overflow-hidden justify-center py-0.5">
                      <span className={`text-[11px] font-bold uppercase leading-normal ${currentRating?.level === RatingLevel.AVERAGE ? 'text-white' : 'text-amber-600 dark:text-amber-500'}`}>
                        {item.criteria[RatingLevel.AVERAGE].label}
                      </span>
                      <span className={`text-[9px] font-medium px-0.5 line-clamp-3 leading-tight whitespace-normal ${
                          currentRating?.level === RatingLevel.AVERAGE ? 'text-amber-50' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {item.criteria[RatingLevel.AVERAGE].description}
                      </span>
                  </div>
               </button>

               {/* Weak Button */}
               <button
                  onClick={() => handleSelect(RatingLevel.WEAK)}
                  className={`flex flex-col items-center justify-center text-center gap-1.5 py-2 px-1 rounded-xl border transition-all duration-200 active:scale-95 ${
                     currentRating?.level === RatingLevel.WEAK
                     ? 'bg-rose-500 border-rose-500 text-white shadow-sm shadow-rose-500/20'
                     : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-rose-500/30 hover:bg-rose-50/50 dark:hover:bg-rose-900/10'
                  }`}
               >
                  <XCircle size={20} className={`transition-transform duration-300 ${currentRating?.level === RatingLevel.WEAK ? 'scale-110 text-white' : 'text-rose-500'}`} />
                  <div className="flex flex-col gap-1 w-full overflow-hidden justify-center py-0.5">
                      <span className={`text-[11px] font-bold uppercase leading-normal ${currentRating?.level === RatingLevel.WEAK ? 'text-white' : 'text-rose-600 dark:text-rose-500'}`}>
                        {item.criteria[RatingLevel.WEAK].label}
                      </span>
                      <span className={`text-[9px] font-medium px-0.5 line-clamp-3 leading-tight whitespace-normal ${
                          currentRating?.level === RatingLevel.WEAK ? 'text-rose-50' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {item.criteria[RatingLevel.WEAK].description}
                      </span>
                  </div>
               </button>
            </div>

            {/* Note Input - Minimal */}
            <div className="relative group/note">
               <Pencil size={11} className="absolute top-3 left-3 text-slate-400 group-focus-within/note:text-indigo-500 transition-colors" />
               <textarea
                  value={currentRating?.notes || ''}
                  onChange={(e) => onNoteChange(item.id, e.target.value)}
                  placeholder="Ghi chú..."
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none resize-none h-[36px] min-h-[36px] transition-all hover:border-slate-300 dark:hover:border-slate-700 focus:shadow-sm"
               />
            </div>
         </div>
      </div>
    </div>
  );
};

export default InputSection;
