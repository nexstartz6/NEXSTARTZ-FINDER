import React, { useState } from 'react';
import { Hexagon, LogIn, UserPlus, Eye, EyeOff, Check, X } from 'lucide-react';
import { GoogleSignInModal } from './GoogleSignInModal';

const GoogleIcon: React.FC = () => (
    <svg viewBox="0 0 48 48" className="w-5 h-5">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const PasswordStrength: React.FC<{ password?: string }> = ({ password = '' }) => {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[^A-Za-z0-9]/.test(password),
    };

    const criteria = [
        { key: 'length', text: 'At least 8 characters' },
        { key: 'uppercase', text: 'One uppercase letter' },
        { key: 'number', text: 'One number' },
        { key: 'specialChar', text: 'One special character' },
    ];

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
            {criteria.map(item => (
                <div key={item.key} className={`flex items-center gap-2 transition-colors ${checks[item.key as keyof typeof checks] ? 'text-green-600' : 'text-slate-500'}`}>
                    {checks[item.key as keyof typeof checks] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4 text-slate-300" />}
                    <span>{item.text}</span>
                </div>
            ))}
        </div>
    );
};

interface AuthProps {
  onSignIn: (email: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onSignIn }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleGoogleSignInClick = () => {
    setIsGoogleModalOpen(true);
  };
  
  const handleGoogleSignInSuccess = (email: string) => {
    onSignIn(email);
    setIsGoogleModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(email);
  };

  return (
    <>
    <div className="h-screen w-screen bg-slate-50 flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.5s ease-out forwards' }}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
            <Hexagon className="text-gold-500 w-10 h-10 mb-3" />
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Nexstartz Finder</h1>
            <p className="text-slate-500 mt-2">Your AI-Powered Supply Chain Partner</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-200">
           <button
              onClick={handleGoogleSignInClick}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-100 transition-all active:scale-[0.99]"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-slate-400">OR</span>
                </div>
            </div>

          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">{isSignIn ? 'Sign in with your email' : 'Create an account'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-500/10 transition-all text-slate-900"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password"className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isSignIn ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-slate-100 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-gold-400 focus:ring-4 focus:ring-gold-500/10 transition-all text-slate-900"
                    placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-gold-500">
                    {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                </button>
              </div>
            </div>

            {!isSignIn && <PasswordStrength password={password} />}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-slate-900 font-bold py-3 rounded-xl hover:shadow-xl hover:shadow-gold-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.99]"
            >
              {isSignIn ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsSignIn(!isSignIn)} className="text-sm text-gold-600 hover:text-gold-700 font-medium hover:underline">
              {isSignIn ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
    <GoogleSignInModal 
      isOpen={isGoogleModalOpen} 
      onClose={() => setIsGoogleModalOpen(false)} 
      onSignInSuccess={handleGoogleSignInSuccess} 
    />
    </>
  );
};