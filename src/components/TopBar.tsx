import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  }

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-200 flex-shrink-0">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {actions}

        {/* Notifications placeholder */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        {/* User badge */}
        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-gray-200">
          <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary-600" />
          </div>
          {auth.username && (
            <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {auth.username}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
