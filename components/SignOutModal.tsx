import React from 'react';
import { Modal } from './Modal';
import { LogOut, AlertTriangle } from 'lucide-react';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirm Sign Out">
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gold-100 mb-4">
                    <AlertTriangle className="h-6 w-6 text-gold-600" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Are you sure you want to sign out?</h3>
                <p className="mt-2 text-sm text-slate-500">
                    You will be returned to the login screen.
                </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full inline-flex justify-center rounded-xl border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="w-full inline-flex justify-center items-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-gold-500 text-base font-bold text-slate-900 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                </button>
            </div>
        </Modal>
    );
};
