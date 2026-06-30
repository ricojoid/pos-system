import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiShield } from 'react-icons/fi';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="w-full min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Profil Saya</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white shadow-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user?.fullName || 'Pengguna'}</h2>
              <p className="text-slate-500">{user?.role || 'Buyer'}</p>
            </div>
          </div>

          <div className="space-y-6 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                <FiUser size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nama Lengkap</p>
                <p className="text-slate-900 font-medium">{user?.fullName || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                <FiMail size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</p>
                <p className="text-slate-900 font-medium">{user?.email || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                <FiShield size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Peran (Role)</p>
                <p className="text-slate-900 font-medium">{user?.role || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
