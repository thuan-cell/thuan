import React, { useState } from 'react';
import { ArrowRight, User, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService, UserAccount } from '../services/authService';

interface LandingPageProps {
  onLoginSuccess: (user: UserAccount) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '', 
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.password) {
        setError("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    if (isRegister) {
         if (!formData.fullName) {
             setError("Vui lòng nhập họ tên.");
             return;
         }
         if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
         }
         if (formData.password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
         }
    }

    setIsLoading(true);
    
    setTimeout(() => {
        if (isRegister) {
            const result = authService.register({
                username: formData.username,
                password: formData.password,
                fullName: formData.fullName,
                role: 'Nhân viên',
                department: 'Vận Hành',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=random`
            });
            if (result.success && result.user) {
                onLoginSuccess(result.user);
            } else {
                setError(result.message);
            }
        } else {
             const result = authService.login(formData.username, formData.password);
             if (result.success && result.user) {
                onLoginSuccess(result.user);
             } else {
                setError(result.message);
             }
        }
        setIsLoading(false);
    }, 800);
  };

  const toggleMode = () => {
      setIsRegister(!isRegister);
      setError(null);
      setFormData({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
      });
  };

  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#0b1121]">
      
      {/* Background Effect */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/5 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[360px] mx-auto px-4 animate-in fade-in duration-700 zoom-in-95">
        
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 p-8">
            
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {isRegister ? 'Nhập thông tin để đăng ký hệ thống' : 'Vui lòng nhập thông tin xác thực'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {error && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center animate-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {isRegister && (
                    <div className="space-y-1.5 animate-in slide-in-from-left-2 fade-in duration-300">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <User size={16} />
                            </div>
                            <input 
                                type="text"
                                placeholder="Họ và tên"
                                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400"
                                value={formData.fullName}
                                onChange={e => setFormData({...formData, fullName: e.target.value})}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1.5">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail size={16} />
                        </div>
                        <input 
                            type="text"
                            placeholder="Tên đăng nhập"
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400"
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                </div>
                
                <div className="space-y-1.5">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock size={16} />
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-10 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {isRegister && (
                        <div className="space-y-1.5 animate-in slide-in-from-left-2 fade-in duration-300">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Lock size={16} />
                            </div>
                            <input 
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                            />
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-900/10 dark:shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                            <>
                                <span>{isRegister ? 'Đăng Ký' : 'Đăng Nhập'}</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="text-center mt-6">
                <button 
                    type="button"
                    onClick={toggleMode}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors focus:outline-none"
                >
                    {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;