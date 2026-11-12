import { create } from 'zustand';
import { storageService } from '../services/storage.service';
import { paymentService } from '../services/payment.service';
import { installmentService } from '../services/installment.service';
import {
  initialGroups,
  initialMembers,
  generateSeedData,
  initialNotifications,
  initialSettings,
} from '../data/seed';

// Initial seed loader
const loadInitialData = () => {
  const storedGroups = storageService.get('groups');
  const storedMembers = storageService.get('members');
  const storedInstallments = storageService.get('installments');
  const storedTransactions = storageService.get('transactions');
  const storedReceipts = storageService.get('receipts');
  const storedPayouts = storageService.get('payouts');
  const storedNotifications = storageService.get('notifications');
  const storedSettings = storageService.get('settings');

  if (storedGroups && storedMembers && storedInstallments) {
    return {
      groups: storedGroups,
      members: storedMembers,
      installments: storedInstallments,
      transactions: storedTransactions || [],
      receipts: storedReceipts || [],
      payouts: storedPayouts || [],
      notifications: storedNotifications || [],
      settings: storedSettings || initialSettings,
    };
  }

  // Generate full rich seed dataset
  const seed = generateSeedData();
  const init = {
    groups: initialGroups,
    members: initialMembers,
    installments: seed.installments,
    transactions: seed.transactions,
    receipts: seed.receipts,
    payouts: seed.payouts,
    notifications: initialNotifications,
    settings: initialSettings,
  };

  // Save to localStorage
  storageService.set('groups', init.groups);
  storageService.set('members', init.members);
  storageService.set('installments', init.installments);
  storageService.set('transactions', init.transactions);
  storageService.set('receipts', init.receipts);
  storageService.set('payouts', init.payouts);
  storageService.set('notifications', init.notifications);
  storageService.set('settings', init.settings);

  return init;
};

const initialData = loadInitialData();

export const useAppStore = create((set, get) => ({
  ...initialData,
  theme: storageService.get('theme', 'light'),

  // Theme toggle
  setTheme: (theme) => {
    storageService.set('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  // CHIT GROUPS
  addGroup: (newGroupData) => {
    const id = `GRP-${new Date().getFullYear()}-${String(get().groups.length + 1).padStart(3, '0')}`;
    const group = {
      ...newGroupData,
      id,
      monthlyInstallment: Math.round(Number(newGroupData.chitValue) / Number(newGroupData.durationMonths)),
      createdAt: new Date().toISOString(),
    };

    // If members are pre-assigned or default members can be assigned
    const assignedMembers = get().members.filter((m) =>
      m.assignedGroupIds && m.assignedGroupIds.includes(id)
    );

    // Auto-generate installments if any members already belong to this group
    const newInstallments = assignedMembers.length > 0
      ? installmentService.generateGroupSchedules(group, assignedMembers)
      : [];

    const updatedGroups = [group, ...get().groups];
    const updatedInstallments = [...newInstallments, ...get().installments];

    storageService.set('groups', updatedGroups);
    storageService.set('installments', updatedInstallments);

    // Add activity notification
    get().addNotification({
      type: 'CHIT',
      title: 'New Chit Group Created',
      message: `Group "${group.name}" with chit value ₹${group.chitValue.toLocaleString('en-IN')} has been established.`,
      link: `/chit-groups/${group.id}`,
    });

    set({ groups: updatedGroups, installments: updatedInstallments });
    return group;
  },

  updateGroup: (groupId, updatedData) => {
    const updatedGroups = get().groups.map((g) => (g.id === groupId ? { ...g, ...updatedData } : g));
    storageService.set('groups', updatedGroups);
    set({ groups: updatedGroups });
  },

  deleteGroup: (groupId) => {
    const updatedGroups = get().groups.filter((g) => g.id !== groupId);
    const updatedInstallments = get().installments.filter((ins) => ins.groupId !== groupId);
    const updatedTransactions = get().transactions.filter((tx) => tx.groupId !== groupId);
    const updatedReceipts = get().receipts.filter((rcpt) => rcpt.groupId !== groupId);

    storageService.set('groups', updatedGroups);
    storageService.set('installments', updatedInstallments);
    storageService.set('transactions', updatedTransactions);
    storageService.set('receipts', updatedReceipts);

    set({
      groups: updatedGroups,
      installments: updatedInstallments,
      transactions: updatedTransactions,
      receipts: updatedReceipts,
    });
  },

  // MEMBERS
  addMember: (newMemberData) => {
    const id = `MEM-${String(get().members.length + 1).padStart(4, '0')}`;
    const member = {
      ...newMemberData,
      id,
      createdAt: new Date().toISOString(),
    };

    // Auto-generate installments for each assigned group
    let generatedInstallments = [];
    if (member.assignedGroupIds && member.assignedGroupIds.length > 0) {
      member.assignedGroupIds.forEach((grpId) => {
        const group = get().groups.find((g) => g.id === grpId);
        if (group) {
          const groupInstallments = installmentService.generateGroupSchedules(group, [member]);
          generatedInstallments = [...generatedInstallments, ...groupInstallments];
        }
      });
    }

    const updatedMembers = [member, ...get().members];
    const updatedInstallments = [...generatedInstallments, ...get().installments];

    storageService.set('members', updatedMembers);
    storageService.set('installments', updatedInstallments);

    get().addNotification({
      type: 'MEMBER',
      title: 'Member Registered',
      message: `${member.fullName} was added with ID ${member.id}.`,
      link: `/members/${member.id}`,
    });

    set({ members: updatedMembers, installments: updatedInstallments });
    return member;
  },

  updateMember: (memberId, updatedData) => {
    const currentMember = get().members.find((m) => m.id === memberId);
    const oldGroupIds = currentMember?.assignedGroupIds || [];
    const newGroupIds = updatedData.assignedGroupIds || oldGroupIds;

    // Check if new groups added
    const newlyAddedGroupIds = newGroupIds.filter((gid) => !oldGroupIds.includes(gid));
    let newInstallments = [];
    newlyAddedGroupIds.forEach((gid) => {
      const grp = get().groups.find((g) => g.id === gid);
      if (grp) {
        newInstallments = [...newInstallments, ...installmentService.generateGroupSchedules(grp, [{ ...currentMember, ...updatedData }])];
      }
    });

    const updatedMembers = get().members.map((m) => (m.id === memberId ? { ...m, ...updatedData } : m));
    const updatedInstallments = [...newInstallments, ...get().installments];

    storageService.set('members', updatedMembers);
    storageService.set('installments', updatedInstallments);
    set({ members: updatedMembers, installments: updatedInstallments });
  },

  deleteMember: (memberId) => {
    const updatedMembers = get().members.filter((m) => m.id !== memberId);
    storageService.set('members', updatedMembers);
    set({ members: updatedMembers });
  },

  assignMemberToGroup: (memberId, groupId) => {
    const member = get().members.find((m) => m.id === memberId);
    const group = get().groups.find((g) => g.id === groupId);
    if (!member || !group) return;

    if (member.assignedGroupIds?.includes(groupId)) return;

    const newGroupIds = [...(member.assignedGroupIds || []), groupId];
    const updatedMember = { ...member, assignedGroupIds: newGroupIds };

    // Generate schedules
    const schedules = installmentService.generateGroupSchedules(group, [member]);
    const updatedMembers = get().members.map((m) => (m.id === memberId ? updatedMember : m));
    const updatedInstallments = [...schedules, ...get().installments];

    storageService.set('members', updatedMembers);
    storageService.set('installments', updatedInstallments);
    set({ members: updatedMembers, installments: updatedInstallments });
  },

  // PAYMENT COLLECTION
  recordPayment: (paymentFormData) => {
    try {
      const result = paymentService.processPayment({
        paymentData: paymentFormData,
        installments: get().installments,
        members: get().members,
        groups: get().groups,
        existingReceiptsCount: get().receipts.length,
      });

      const { updatedInstallment, newTransaction, newReceipt } = result;

      // Update installments
      const updatedInstallments = get().installments.map((ins) =>
        ins.id === updatedInstallment.id ? updatedInstallment : ins
      );

      const updatedTransactions = [newTransaction, ...get().transactions];
      const updatedReceipts = [newReceipt, ...get().receipts];

      // Persist atomically
      storageService.set('installments', updatedInstallments);
      storageService.set('transactions', updatedTransactions);
      storageService.set('receipts', updatedReceipts);

      // Trigger notification
      get().addNotification({
        type: 'PAYMENT',
        title: `Payment Received: ₹${newTransaction.amount.toLocaleString('en-IN')}`,
        message: `${newReceipt.memberName} paid Month ${newReceipt.installmentNumber} (${newReceipt.receiptNumber}).`,
        link: '/receipts',
      });

      set({
        installments: updatedInstallments,
        transactions: updatedTransactions,
        receipts: updatedReceipts,
      });

      return { success: true, receipt: newReceipt, transaction: newTransaction };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // PAYOUTS / AUCTIONS
  recordPayout: (payoutFormData) => {
    const group = get().groups.find((g) => g.id === payoutFormData.groupId);
    const member = get().members.find((m) => m.id === payoutFormData.memberId);

    const gross = Number(payoutFormData.grossAmount);
    const discount = Number(payoutFormData.discountBidAmount);
    const commPercent = Number(payoutFormData.companyCommissionPercent) || 5;
    const commAmount = Math.round((gross * commPercent) / 100);
    const netPayout = gross - discount;
    const memberCount = group?.memberCount || 20;
    const dividend = Math.round((discount - commAmount) / memberCount);

    const newPayout = {
      id: `PO-${new Date().getFullYear()}-${String(get().payouts.length + 1).padStart(3, '0')}`,
      groupId: payoutFormData.groupId,
      groupName: group?.name || 'Chit Group',
      memberId: payoutFormData.memberId,
      memberName: member?.fullName || 'Member',
      installmentNumber: Number(payoutFormData.installmentNumber),
      grossAmount: gross,
      discountBidAmount: discount,
      companyCommissionPercent: commPercent,
      companyCommissionAmount: commAmount,
      netPayoutAmount: netPayout,
      dividendPerMember: dividend > 0 ? dividend : 0,
      payoutDate: payoutFormData.payoutDate,
      paymentMethod: payoutFormData.paymentMethod,
      referenceNumber: payoutFormData.referenceNumber,
      status: 'COMPLETED',
      notes: payoutFormData.notes || '',
      createdAt: new Date().toISOString(),
    };

    const updatedPayouts = [newPayout, ...get().payouts];
    storageService.set('payouts', updatedPayouts);

    get().addNotification({
      type: 'AUCTION',
      title: `Payout Released: ₹${netPayout.toLocaleString('en-IN')}`,
      message: `Auction winning sum paid to ${member?.fullName} for Installment #${newPayout.installmentNumber}.`,
      link: '/payouts',
    });

    set({ payouts: updatedPayouts });
    return newPayout;
  },

  // NOTIFICATIONS
  addNotification: (notif) => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notif,
    };
    const updated = [newNotif, ...get().notifications];
    storageService.set('notifications', updated);
    set({ notifications: updated });
  },

  markNotificationAsRead: (id) => {
    const updated = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    storageService.set('notifications', updated);
    set({ notifications: updated });
  },

  markAllNotificationsAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }));
    storageService.set('notifications', updated);
    set({ notifications: updated });
  },

  // SETTINGS
  updateSettings: (newSettings) => {
    const merged = { ...get().settings, ...newSettings };
    storageService.set('settings', merged);
    set({ settings: merged });
  },

  // RESET / IMPORT / EXPORT DATA
  resetDemoData: () => {
    storageService.clearAll();
    const fresh = generateSeedData();
    const freshData = {
      groups: initialGroups,
      members: initialMembers,
      installments: fresh.installments,
      transactions: fresh.transactions,
      receipts: fresh.receipts,
      payouts: fresh.payouts,
      notifications: initialNotifications,
      settings: initialSettings,
    };

    storageService.set('groups', freshData.groups);
    storageService.set('members', freshData.members);
    storageService.set('installments', freshData.installments);
    storageService.set('transactions', freshData.transactions);
    storageService.set('receipts', freshData.receipts);
    storageService.set('payouts', freshData.payouts);
    storageService.set('notifications', freshData.notifications);
    storageService.set('settings', freshData.settings);

    set(freshData);
  },

  importData: (importedJson) => {
    try {
      const data = typeof importedJson === 'string' ? JSON.parse(importedJson) : importedJson;
      if (data.groups && data.members) {
        storageService.set('groups', data.groups);
        storageService.set('members', data.members);
        storageService.set('installments', data.installments || []);
        storageService.set('transactions', data.transactions || []);
        storageService.set('receipts', data.receipts || []);
        storageService.set('payouts', data.payouts || []);
        set({ ...data });
        return { success: true };
      }
      return { success: false, error: 'Invalid data format' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
}));

