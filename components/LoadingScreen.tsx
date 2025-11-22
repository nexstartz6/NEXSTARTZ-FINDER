import React from 'react';
import { Hexagon } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const appName = "Nexstartz Finder";

  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center" style={{ animation: 'fadeIn 0.5s ease-out forwards' }}>
      <div className="flex items-center gap-4 mb-2">
         <Hexagon className="text-gold-500 w-10 h-10 animate-pulse" style={{ animationDuration: '1.5s' }} />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
        {appName.split('').map((char, index) => (
          <span
            key={index}
            className="inline-block"
            style={{
              opacity: 0,
              animation: `fadeInUp 0.5s ease-out forwards`,
              animationDelay: `${0.3 + index * 0.05}s`
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
    </div>
  );
};