import React from 'react';
import { Hexagon, Twitter, Linkedin, Facebook } from 'lucide-react';

interface FooterProps {
  onAboutClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onReviewClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAboutClick, onPrivacyClick, onTermsClick, onReviewClick }) => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <Hexagon className="text-gold-500 w-8 h-8" />
              <span className="text-xl font-bold text-white tracking-tight">Nexstartz Finder</span>
            </div>
            <p className="text-sm text-slate-400">
              Your AI-Powered Supply Chain Partner.
            </p>
          </div>

          {/* Column 2: Company & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase">Company & Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <button onClick={onAboutClick} className="text-base text-slate-400 hover:text-gold-400 transition-colors">About Us</button>
              </li>
              <li>
                <button onClick={onPrivacyClick} className="text-base text-slate-400 hover:text-gold-400 transition-colors">Privacy Policy</button>
              </li>
              <li>
                <button onClick={onTermsClick} className="text-base text-slate-400 hover:text-gold-400 transition-colors">Terms & Conditions</button>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Feedback & Connect */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase">Feedback & Connect</h3>
            <ul className="mt-4 space-y-3">
               <li>
                <button onClick={onReviewClick} className="text-base text-slate-400 hover:text-gold-400 transition-colors">Leave a Review</button>
              </li>
            </ul>
             <div className="flex space-x-5 mt-6">
              <a href="#" className="text-slate-400 hover:text-gold-400 hover:scale-110 transition-all">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-gold-400 hover:scale-110 transition-all">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-gold-400 hover:scale-110 transition-all">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-base text-slate-400 text-center">&copy; 2025 Nexstartz Finder. Created by Nexstratz.</p>
        </div>
      </div>
    </footer>
  );
};