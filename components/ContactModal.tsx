import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Send, Loader2, CheckCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, businessName }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const subject = `Inquiry regarding ${businessName}`;

  useEffect(() => {
    // Reset state when modal is closed
    if (!isOpen) {
      setTimeout(() => {
        setIsSent(false);
        setMessage('');
      }, 300); // delay to allow for closing animation
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Contact ${businessName}`}>
        {isSent ? (
             <div className="text-center p-8 flex flex-col items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-800">Message Sent!</h3>
                <p className="text-slate-500 mt-2">We've simulated sending your message to {businessName}.</p>
             </div>
        ) : (
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                        <input type="text" readOnly value={businessName} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                        <input type="text" readOnly value={subject} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <textarea 
                            id="message"
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            placeholder="Type your inquiry here..."
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 transition"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                     <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
                     <button
                        type="submit"
                        disabled={isSending || !message.trim()}
                        className="bg-gold-500 text-slate-900 font-bold py-2 px-6 rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
                    >
                        {isSending ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        )}
    </Modal>
  );
};
