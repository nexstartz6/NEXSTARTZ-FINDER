import React, { useState, useEffect } from 'react';

const GoogleLogo: React.FC = () => (
    <svg className="w-8 h-8" viewBox="0 0 48 48" >
        <path fill="#4285F4" d="M24 9.8c3.2 0 6.1 1.1 8.4 3.2l6.3-6.3C34.9 2.8 29.9 1 24 1 14.9 1 7.1 6.5 3.3 14.3l7.6 5.9C12.8 14.2 18 9.8 24 9.8z"></path>
        <path fill="#34A853" d="M46.2 25.1c0-1.6-0.1-3.2-0.4-4.8H24v9.1h12.5c-0.5 3-2.1 5.6-4.5 7.3l7.5 5.8C43.4 39.1 46.2 32.7 46.2 25.1z"></path>
        <path fill="#FBBC05" d="M10.9 28.2c-0.6-1.8-1-3.7-1-5.7s0.3-3.9 1-5.7L3.3 11C1.2 15.3 0 20.5 0 26.1c0 5.6 1.2 10.8 3.3 15.1L10.9 28.2z"></path>
        <path fill="#EA4335" d="M24 47c5.9 0 11-1.9 14.7-5.1l-7.5-5.8c-2 1.3-4.5 2.1-7.2 2.1-6 0-11.2-4.4-13.1-10.2l-7.6 5.9C7.1 40.5 14.9 47 24 47z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);


interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (email: string) => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({ isOpen, onClose, onSignInSuccess }) => {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Allow animation to finish before unmounting
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onSignInSuccess(email);
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const handleClose = () => {
      onClose();
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)'}}
        onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-lg w-full max-w-sm transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border border-slate-300 rounded-lg p-8">
            <div className="flex flex-col items-center text-center mb-8">
                <GoogleLogo />
                <h1 className="text-2xl font-normal text-slate-900 mt-4">Sign in</h1>
                <p className="text-slate-600 mt-2">to continue to Nexstartz Finder</p>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <input 
                        type="email" 
                        id="google-email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="block px-3 pb-2.5 pt-4 w-full text-sm text-slate-900 bg-transparent rounded-md border border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                        placeholder=" " 
                    />
                    <label 
                        htmlFor="google-email" 
                        className="absolute text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                        Email or phone
                    </label>
                </div>
                
                <button type="button" className="text-sm font-semibold text-blue-600 hover:bg-blue-50/50 p-1 rounded mt-2">
                    Forgot email?
                </button>
                
                <div className="mt-8 flex justify-end items-center">
                    <button type="button" onClick={handleClose} className="font-semibold text-blue-600 hover:bg-blue-50/50 px-4 py-2 rounded-md transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Next
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};