import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Star, Loader2, CheckCircle } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setIsSubmitted(false);
                setRating(0);
                setFeedback('');
            }, 300);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 1500);
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review">
        {isSubmitted ? (
            <div className="text-center p-8 flex flex-col items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-800">Thank You!</h3>
                <p className="text-slate-500 mt-2">Your feedback helps us improve Nexstartz Finder.</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">How would you rate your experience?</label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    className={`w-8 h-8 cursor-pointer transition-all ${
                                        (hoverRating || rating) >= star ? 'text-gold-400 fill-current scale-110' : 'text-slate-300'
                                    }`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 mb-1">Comments (optional)</label>
                        <textarea
                            id="feedback"
                            rows={4}
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            placeholder="Tell us what you liked or what could be improved."
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 transition"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="bg-gold-500 text-slate-900 font-bold py-2 px-6 rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[150px]"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : null}
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        )}
    </Modal>
  );
};
