import React, { useState, useMemo } from 'react';
import { Vip } from '../constants';
import { AddEditVipModal, AdminVipTable } from './Table';
import { PlusIcon, LogoutIcon } from './Icon';

// --- SUPER ADMIN VIEW ---
interface SuperAdminViewProps {
  vips: Vip[];
  onAddVip: (vip: Omit<Vip, 'UID' | 'Created_At'>) => void;
  onUpdateVip: (vip: Vip) => void;
  onLogout: () => void;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({ vips, onAddVip, onUpdateVip, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVip, setEditingVip] = useState<Vip | null>(null);

  const filteredVips = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return vips.filter(vip =>
      Object.values(vip).some(value =>
        String(value).toLowerCase().includes(lowercasedTerm)
      )
    );
  }, [vips, searchTerm]);
  
  const handleEdit = (vip: Vip) => {
    setEditingVip(vip);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingVip(null);
    setIsModalOpen(true);
  };

  const handleModalSave = (vipData: Vip | Omit<Vip, 'UID' | 'Created_At'>) => {
    if ('UID' in vipData) {
      onUpdateVip(vipData);
    } else {
      onAddVip(vipData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-screen flex flex-col p-4 sm:p-6 lg:p-8 bg-gray-900 text-gray-300">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <button onClick={handleAddNew} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            <PlusIcon className="w-5 h-5" />
            Add VIP
          </button>
          <button onClick={onLogout} title="Logout" className="p-2 rounded-full hover:bg-gray-700 transition-colors">
             <LogoutIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </header>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search all fields..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full max-w-lg bg-gray-800 border border-gray-700 text-white rounded-lg py-2 px-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
      </div>

      <main className="flex-1 overflow-x-auto">
         <AdminVipTable vips={filteredVips} onEdit={handleEdit} />
      </main>

      {isModalOpen && (
        <AddEditVipModal
          vip={editingVip}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

// --- REGULAR ADMIN VIEW ---
interface RegularAdminViewProps {
  onAddVip: (vip: Omit<Vip, 'UID' | 'Created_At'>) => void;
  onLogout: () => void;
}

export const RegularAdminView: React.FC<RegularAdminViewProps> = ({ onAddVip, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalSave = (vipData: Omit<Vip, 'UID' | 'Created_At'>) => {
    onAddVip(vipData);
    setIsModalOpen(false);
    alert('VIP successfully added!');
  };
  
  return (
    <div className="w-full h-screen flex flex-col p-4 sm:p-6 lg:p-8 bg-gray-900 text-gray-300">
       <header className="flex justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
        <button onClick={onLogout} title="Logout" className="flex items-center gap-2 text-gray-400 hover:text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
          <LogoutIcon className="w-6 h-6" />
          <span>Logout</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 max-w-md">
          <h2 className="text-2xl font-semibold text-white mb-2">Welcome, Admin</h2>
          <p className="text-gray-400 mb-6">Use the button below to add a new VIP record to the registry.</p>
          <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
            <PlusIcon className="w-6 h-6" />
            Add New VIP
          </button>
        </div>
      </main>

       {isModalOpen && (
        <AddEditVipModal
          vip={null}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  )
}