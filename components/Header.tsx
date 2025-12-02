
import React from 'react';
import { Sun, Moon, ChevronDown, User, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  userProfile?: { name: string; role: string; avatar?: string };
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  toggleTheme, 
  isLoggedIn, 
  userProfile, 
  onLoginClick,
  onLogoutClick 
}) => {
  return (
    <header className="shrink-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/50 no-print sticky top-0 transition-all duration-300">
        <div className="max-w-[1920px] mx-auto px-6 h-[64px] flex items-center justify-end">
          
          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title="Đổi giao diện"
            >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>

            {/* Login / User Profile */}
            <div>
                {isLoggedIn && userProfile ? (
                    <div className="flex items-center gap-3 group cursor-pointer relative">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-slate-800 dark:text-white leading-none">{userProfile.name}</div>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                            {userProfile.avatar ? (
                                <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                                    <User size={18} />
                                </div>
                            )}
                        </div>
                        
                        {/* Dropdown */}
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 p-1 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                             <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 sm:hidden">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{userProfile.name}</p>
                             </div>
                             <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                <Settings size={14} /> Cài đặt
                             </button>
                             <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                             <button 
                                onClick={onLogoutClick}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                            >
                                <LogOut size={14} /> Đăng xuất
                             </button>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={onLoginClick}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all"
                    >
                        <span>Đăng Nhập</span>
                        <ChevronDown size={12} className="-rotate-90" />
                    </button>
                )}
            </div>
          </div>
        </div>
    </header>
  );
};

export default Header;
