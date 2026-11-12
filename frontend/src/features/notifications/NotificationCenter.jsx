import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  CreditCard,
  Trophy,
  UserPlus,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatDate } from '../../utils/date';
import { toast } from 'sonner';

export const NotificationCenter = () => {
  const navigate = useNavigate();
  const notifications = useAppStore((state) => state.notifications);
  const markNotificationAsRead = useAppStore((state) => state.markNotificationAsRead);
  const markAllNotificationsAsRead = useAppStore((state) => state.markAllNotificationsAsRead);

  const getIcon = (type) => {
    switch (type) {
      case 'OVERDUE':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />;
      case 'PAYMENT':
        return <CreditCard className="w-3.5 h-3.5 text-emerald-500" />;
      case 'AUCTION':
        return <Trophy className="w-3.5 h-3.5 text-indigo-500" />;
      case 'MEMBER':
        return <UserPlus className="w-3.5 h-3.5 text-sky-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const handleMarkAll = () => {
    markAllNotificationsAsRead();
    toast.success('All notifications marked as read.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e2e4e9] dark:border-[#1e283d]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            System Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational reminders for default dues, collection updates, and upcoming auction dates.
          </p>
        </div>

        <button
          onClick={handleMarkAll}
          className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] hover:bg-slate-50 rounded-md shadow-xs flex items-center gap-1.5"
        >
          <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] overflow-hidden shadow-xs divide-y divide-[#e2e4e9]/70 dark:divide-[#1e283d]">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationAsRead(n.id);
                if (n.link) navigate(n.link);
              }}
              className={`p-3.5 flex items-start justify-between cursor-pointer transition-colors ${
                n.read
                  ? 'hover:bg-slate-50/70 dark:hover:bg-[#182032]'
                  : 'bg-indigo-50/20 dark:bg-indigo-950/20 hover:bg-indigo-50/40'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-xs ${
                        n.read ? 'font-medium text-slate-700 dark:text-slate-300' : 'font-bold text-slate-900 dark:text-white'
                      }`}
                    >
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatDate(n.timestamp, 'dd MMM yyyy, hh:mm a')}
                  </p>
                </div>
              </div>

              {n.link && (
                <span className="text-slate-400 hover:text-indigo-600 p-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No system notifications at this time.
          </div>
        )}
      </div>
    </div>
  );
};
