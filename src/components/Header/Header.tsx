import React from 'react';
import { UserMenu } from './UserMenu';
import type { User } from '../../types';

type HeaderProps = {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
};

export const Header: React.FC<HeaderProps> = ({ user, onNavigate, onSignOut }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Course Scheduler</h1>
          </div>
          <div className="flex items-center">
            <UserMenu user={user} onNavigate={onNavigate} onSignOut={onSignOut} />
          </div>
        </div>
      </div>
    </header>
  );
};