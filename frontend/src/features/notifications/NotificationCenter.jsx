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
import { PageHeader } from '../../components/common/PageHeader';
import { toast } from 'sonner';

export const NotificationCenter = () => {
  const navigate = useNavigate();
  const notifications = useAppStore((state) => state.notifications);
  const markNotificationAsRead = useAppStore((state) => state.markNotificationAsRead);
  const markAllNotificationsAsRead = useAppStore((state) => state.markAllNotificationsAsRead);

  const getIcon = (type) => {
    switch (type) {
      case 'OVERDUE':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'PAYMENT':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'AUCTION':
        return <Trophy className="w-4 h-4 text-indigo-500" />;
      case 'MEMBER':
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleMarkAll = () => {
    markAllNotificationsAsRead();
    toast.success('All notifications marked as read.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Notification Center"
        subtitle="In-app alerts for overdue installments, real-time payments, and auction schedules"
        breadcrumbs={['ChitFlow', 'Notifications']}
        action={
          <button
            onClick={handleMarkAll}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        }
      />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationAsRead(n.id);
                if (n.link) navigate(n.link);
              }}
              className={`p-4 flex items-start justify-between cursor-pointer transition-colors ${
                n.read
                  ? 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                  : 'bg-indigo-50/30 dark:bg-indigo-950/20 hover:bg-indigo-50/50'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-xs ${
                        n.read ? 'font-semibold text-slate-700 dark:text-slate-300' : 'font-bold text-slate-900 dark:text-white'
                      }`}
                    >
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1.5">
                    <Clock className="w-3 h-3" />
                    {formatDate(n.timestamp, 'dd MMM yyyy, hh:mm a')}
                  </p>
                </div>
              </div>

              {n.link && (
                <span className="text-slate-400 hover:text-indigo-600 p-1">
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-slate-500">
            No active notifications at this time.
          </div>
        )}
      </div>
    </div>
  );
};

