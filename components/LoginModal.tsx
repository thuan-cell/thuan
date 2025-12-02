import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Loader2, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authService, UserAccount } from '../services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  defaultMode?: 'login' | 'register';
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, defaultMode = 'login' }) => {
  const [isRegister, setIsRegister] = useState(defaultMode === 'register');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '', 
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isOpen) {
      setIsRegister(defaultMode === 'register');
      setError(null);
      setIsLoading(false);
      setFormData({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

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
                role: 'Nhân viên', // Default role
                department: 'Vận Hành',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=random`
            });
            if (result.success && result.user) {
                onLoginSuccess(result.user);
                onClose();
            } else {
                setError(result.message);
            }
        } else {
             const result = authService.login(formData.username, formData.password);
             if (result.success && result.user) {
                onLoginSuccess(result.user);
                onClose();
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
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
            <X size={20} />
        </button>

        <div className="pt-10 pb-6 px-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                {isRegister ? 'Nhập thông tin cá nhân của bạn để bắt đầu.' : 'Chào mừng trở lại! Vui lòng nhập thông tin.'}
            </p>
        </div>

        <div className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {error && (
                    <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                        {error}
                    </div>
                )}

                {isRegister && (
                    <div className="space-y-4 animate-in slide-in-from-left-2 fade-in duration-300">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Họ và tên</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input 
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                    value={formData.fullName}
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Tên đăng nhập</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input 
                                type="text"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Mật khẩu</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input 
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-10 text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {isRegister && (
                         <div className="space-y-1.5 animate-in slide-in-from-left-2 fade-in duration-300">
                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Xác nhận mật khẩu</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input 
                                    type="password"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-9 pr-4 text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                            <>
                                <span>{isRegister ? 'Đăng Ký' : 'Đăng Nhập'}</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </div>

                <div className="text-center pt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                        <button 
                            type="button"
                            onClick={toggleMode}
                            className="ml-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
                        >
                            {isRegister ? 'Đăng nhập ngay' : 'Đăng ký mới'}
                        </button>
                    </p>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;