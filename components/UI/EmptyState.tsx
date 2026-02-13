
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon = '📂', action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-20 text-center animate-fade-in">
      <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] flex items-center justify-center text-4xl mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mb-8">{description}</p>
      {action && (
        <button 
          onClick={action.onClick}
          className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
