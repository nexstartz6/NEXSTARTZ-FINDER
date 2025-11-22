import React from 'react';
import { MapPin, Mic, MessageSquare } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: AppView.FINDER, icon: MapPin, label: 'Finder' },
    { id: AppView.LIVE, icon: Mic, label: 'Live' },
    { id: AppView.CHAT, icon: MessageSquare, label: 'Assistant' },
  ];

  return (
    <nav className="fixed bottom-0 md:bottom-4 inset-x-0 z-50 flex justify-center">
      <div className="w-full max-w-md md:w-auto flex justify-around items-center bg-white/80 md:rounded-full backdrop-blur-lg border-t md:border border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:shadow-xl md:shadow-slate-300/40 md:gap-2 md:p-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            title={item.label}
            className={`flex flex-col items-center justify-center p-2 transition-all duration-200 rounded-lg w-full h-16 
              md:w-16 md:h-16 md:rounded-full
              ${currentView === item.id 
                ? 'text-slate-900 bg-gold-500' 
                : 'text-slate-500 hover:text-gold-500 hover:bg-slate-100'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium mt-1 md:hidden">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};