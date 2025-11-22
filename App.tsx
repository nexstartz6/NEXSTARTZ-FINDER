import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { BusinessFinder } from './components/BusinessFinder';
import { Header } from './components/Header';
import { Auth } from './components/Auth';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { ReviewModal } from './components/ReviewModal';
import { SignOutModal } from './components/SignOutModal';
import { AboutContent, PrivacyContent, TermsContent } from './components/InfoPages';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalData, setInfoModalData] = useState<{title: string, content: React.ReactNode} | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    const email = localStorage.getItem('userEmail');
    if (loggedIn && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
    }

    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);
  
  const handleSignIn = (email: string) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleSignOutRequest = () => {
    setIsSignOutModalOpen(true);
  };
  
  const handleSignOutConfirm = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail(null);
    setIsSignOutModalOpen(false);
  };

  const openInfoModal = (title: string, content: React.ReactNode) => {
    setInfoModalData({title, content});
    setIsInfoModalOpen(true);
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Auth onSignIn={handleSignIn} />;
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Header onSignOut={handleSignOutRequest} userEmail={userEmail} />
      <main className="flex-1 overflow-y-auto pt-16 pb-8">
        <BusinessFinder />
      </main>
      <Footer
        onAboutClick={() => openInfoModal('About Us', <AboutContent />)}
        onPrivacyClick={() => openInfoModal('Privacy Policy', <PrivacyContent />)}
        onTermsClick={() => openInfoModal('Terms & Conditions', <TermsContent />)}
        onReviewClick={() => setIsReviewModalOpen(true)}
      />

      {/* Modals */}
      <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} title={infoModalData?.title || ''}>
        {infoModalData?.content}
      </Modal>
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      <SignOutModal isOpen={isSignOutModalOpen} onClose={() => setIsSignOutModalOpen(false)} onConfirm={handleSignOutConfirm} />
    </div>
  );
};

export default App;