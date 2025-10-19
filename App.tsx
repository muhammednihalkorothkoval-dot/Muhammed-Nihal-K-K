import React, { useState } from 'react';
import { Vip, INITIAL_VIP_DATA, ADMIN_PIN, SUPER_ADMIN_PIN } from './constants';
import { UserView } from './components/Section';
import { SuperAdminView, RegularAdminView } from './components/Sidebar';
import { AdminLoginModal } from './components/CodeBlock';

type AuthLevel = 'none' | 'admin' | 'super-admin';

const App: React.FC = () => {
  const [vips, setVips] = useState<Vip[]>(INITIAL_VIP_DATA);
  const [authLevel, setAuthLevel] = useState<AuthLevel>('none');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleAddVip = (vip: Omit<Vip, 'UID' | 'Created_At'>) => {
    const newVip: Vip = {
      ...vip,
      UID: `uid_${Date.now()}`,
      Created_At: new Date().toISOString(),
    };
    setVips(prevVips => [newVip, ...prevVips]);
  };

  const handleUpdateVip = (updatedVip: Vip) => {
    setVips(prevVips =>
      prevVips.map(vip => (vip.UID === updatedVip.UID ? updatedVip : vip))
    );
  };
  
  const handleLoginAttempt = (pin: string) => {
    if (pin === SUPER_ADMIN_PIN) {
      setAuthLevel('super-admin');
      setIsLoginModalOpen(false);
    } else if (pin === ADMIN_PIN) {
      setAuthLevel('admin');
      setIsLoginModalOpen(false);
    } else {
      alert('Incorrect PIN');
    }
  };
  
  const handleLogout = () => {
    setAuthLevel('none');
  };

  const renderView = () => {
    switch(authLevel) {
      case 'super-admin':
        return (
          <SuperAdminView
            vips={vips}
            onAddVip={handleAddVip}
            onUpdateVip={handleUpdateVip}
            onLogout={handleLogout}
          />
        );
      case 'admin':
        return (
          <RegularAdminView 
            onAddVip={handleAddVip}
            onLogout={handleLogout}
          />
        );
      case 'none':
      default:
        return (
          <UserView vips={vips} onAdminLoginClick={() => setIsLoginModalOpen(true)} />
        );
    }
  }

  return (
    <>
      {renderView()}
      {isLoginModalOpen && (
        <AdminLoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLoginAttempt}
        />
      )}
    </>
  );
};

export default App;