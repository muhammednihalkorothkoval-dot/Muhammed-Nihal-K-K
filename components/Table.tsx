import React, { useState, useEffect } from 'react';
import { Vip } from '../constants';
import { EditIcon, CloseIcon } from './Icon';

// --- ADMIN VIP TABLE ---
interface AdminVipTableProps {
  vips: Vip[];
  onEdit: (vip: Vip) => void;
}

export const AdminVipTable: React.FC<AdminVipTableProps> = ({ vips, onEdit }) => {
  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700/50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Position</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">State</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Received Book</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {vips.length > 0 ? vips.map((vip) => (
            <tr key={vip.UID} className="hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{vip.Full_Name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vip.Position}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vip.State}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ vip.Received === 'Yes' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300' }`}>
                  {vip.Received}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => onEdit(vip)} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                  <EditIcon className="w-4 h-4" /> Edit
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-500">No VIPs found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


// --- ADD/EDIT VIP MODAL ---
interface AddEditVipModalProps {
  vip: Vip | null;
  onClose: () => void;
  onSave: (vipData: Vip | Omit<Vip, 'UID' | 'Created_At'>) => void;
}

export const AddEditVipModal: React.FC<AddEditVipModalProps> = ({ vip, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Vip, 'UID' | 'Created_At'>>({
    Full_Name: '', Position: '', State: '', Email: '', Phone: '', Book_Title: '',
    Received: 'No', Date_Received: '', Admin_Name: '', Rating: 0, Flags: '',
    Created_By: '', Notes: '',
  });

  useEffect(() => {
    if (vip) {
      setFormData(vip);
    }
  }, [vip]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, Rating: parseInt(e.target.value, 10) }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vip) {
      onSave({ ...formData, UID: vip.UID, Created_At: vip.Created_At });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-700 flex flex-col max-h-[90vh]">
        <header className="p-4 flex justify-between items-center border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">{vip ? 'Edit VIP' : 'Add New VIP'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formData).map(key => {
              const fieldKey = key as keyof typeof formData;
              if (fieldKey === 'Notes') return null; // Handle textarea separately
              if (fieldKey === 'Received') return null; // Handle select separately
              if (fieldKey === 'Rating') return null; // Handle range separately

              return (
                 <div key={fieldKey}>
                  <label htmlFor={fieldKey} className="block text-sm font-medium text-gray-300 capitalize mb-1">
                    {fieldKey.replace(/_/g, ' ')}
                  </label>
                  <input
                    type={fieldKey === 'Email' ? 'email' : fieldKey === 'Phone' ? 'tel' : 'text'}
                    name={fieldKey}
                    id={fieldKey}
                    value={String(formData[fieldKey])}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              );
            })}
             <div>
              <label htmlFor="Received" className="block text-sm font-medium text-gray-300 mb-1">Received Book</label>
              <select name="Received" id="Received" value={formData.Received} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:ring-1 focus:ring-cyan-500 focus:outline-none">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
             <div>
                <label htmlFor="Rating" className="block text-sm font-medium text-gray-300 mb-1">Rating: {formData.Rating}/5</label>
                <input type="range" id="Rating" name="Rating" min="0" max="5" value={formData.Rating} onChange={handleRatingChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="Notes" className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
              <textarea
                name="Notes"
                id="Notes"
                value={formData.Notes}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              ></textarea>
            </div>
          </div>
          <footer className="mt-8 pt-6 border-t border-gray-700 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Save Changes
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};