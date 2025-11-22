import React from 'react';
import { Hexagon, LogOut } from 'lucide-react';

interface HeaderProps {
  onSignOut: () => void;
  userEmail?: string | null;
}

export const Header: React.FC<HeaderProps> = ({ onSignOut, userEmail }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-700 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Hexagon className="text-gold-500 w-8 h-8" />
            <span className="text-xl font-bold text-white tracking-tight">Nexstartz Finder</span>
          </div>
          <div className="flex items-center gap-4">
            {userEmail && (
              <div className="hidden sm:flex items-center gap-2 text-sm bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                <span className="font-medium text-slate-300">{userEmail}</span>
              </div>
            )}
            <button
              onClick={onSignOut}
              className="group flex items-center gap-2 rounded-full border border-slate-700 hover:border-gold-500/30 bg-slate-800/50 hover:bg-gold-500/10 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-gold-400 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:scale-90" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};