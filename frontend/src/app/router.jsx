import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { DashboardOverview } from '../features/dashboard/DashboardOverview';
import { ChitGroupList } from '../features/chit-groups/ChitGroupList';
import { ChitGroupDetail } from '../features/chit-groups/ChitGroupDetail';
import { MemberList } from '../features/members/MemberList';
import { MemberProfile } from '../features/members/MemberProfile';
import { CollectionCalendar } from '../features/collections/CollectionCalendar';
import { RecordPayment } from '../features/payments/RecordPayment';
import { PayoutList } from '../features/payouts/PayoutList';
import { ReceiptList } from '../features/receipts/ReceiptList';
import { ReportsDashboard } from '../features/reports/ReportsDashboard';
import { NotificationCenter } from '../features/notifications/NotificationCenter';
import { SettingsPage } from '../features/settings/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: 'chit-groups', element: <ChitGroupList /> },
      { path: 'chit-groups/:id', element: <ChitGroupDetail /> },
      { path: 'members', element: <MemberList /> },
      { path: 'members/:id', element: <MemberProfile /> },
      { path: 'collections', element: <CollectionCalendar /> },
      { path: 'payments', element: <RecordPayment /> },
      { path: 'payouts', element: <PayoutList /> },
      { path: 'receipts', element: <ReceiptList /> },
      { path: 'reports', element: <ReportsDashboard /> },
      { path: 'notifications', element: <NotificationCenter /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

