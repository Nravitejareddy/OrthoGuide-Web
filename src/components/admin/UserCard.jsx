import React from 'react';
import { User, Shield, Key, Trash2, UserCheck } from 'lucide-react';

export default function UserCard({ user, onEdit, onResetPassword, onDelete, onReactivate }) {
  const isClinician = user.role === 'clinician';
  const roleLabel = isClinician ? (user.role_type || 'Staff') : 'Patient';
  const isActive = user.is_active !== false && user.status !== 'Inactive';
  const statusColor = isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-400 border-gray-200';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row items-center justify-between gap-4">
      <div 
        onClick={() => onEdit && onEdit(user)}
        className="flex items-center flex-grow text-left cursor-pointer hover:bg-gray-50/50 rounded-xl p-2 -m-2 transition-colors"
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-6 ${isClinician ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
          {isClinician ? <Shield size={22} /> : <User size={22} />}
        </div>
        
        <div className="flex items-center flex-grow text-left">
          {/* Name Area */}
          <div className="w-[30%] min-w-[150px] pr-4">
            <h3 className="text-base font-black text-gray-900 leading-tight truncate group-hover:text-purple-600 transition-colors">{user.name}</h3>
            <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isClinician ? 'text-purple-600' : 'text-blue-600'}`}>
                {isClinician ? roleLabel : (user.treatment_stage || 'Patient')}
            </p>
          </div>
          
          {/* ID Area */}
          <div className="w-[25%] pr-4 uppercase text-center md:text-left">
            <span className="text-[11px] font-bold text-gray-700 font-mono tracking-tight">
              ID: {user.id || user.clinician_id || user.patient_id}
            </span>
          </div>
          
          {/* Status Area */}
          <div className="w-[15%] text-center md:text-left">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 inline-block transition-colors ${statusColor}`}>
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
        <button
          onClick={() => onResetPassword(user)}
          className="flex-grow md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-xs font-bold hover:bg-purple-100 transition-colors"
        >
          <Key size={14} />
          Reset Password
        </button>
        
        {isActive ? (
            <button
                onClick={() => onDelete(user)}
                className="flex-grow md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                >
                <Trash2 size={14} />
                Deactivate
            </button>
        ) : (
            <button
                onClick={() => onReactivate(user)}
                className="flex-grow md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
                >
                <UserCheck size={14} />
                Reactivate
            </button>
        )}
      </div>
    </div>
  );
}
