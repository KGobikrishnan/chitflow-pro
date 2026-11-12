import { z } from 'zod';

export const chitGroupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters'),
  chitValue: z.coerce.number().min(10000, 'Minimum chit value is ₹10,000'),
  memberCount: z.coerce.number().min(2, 'Must have at least 2 members'),
  durationMonths: z.coerce.number().min(2, 'Duration must be at least 2 months'),
  startDate: z.string().min(1, 'Start date is required'),
  collectionDueDate: z.coerce.number().min(1).max(31, 'Due date must be between 1 and 31'),
  gracePeriodDays: z.coerce.number().min(0, 'Grace period cannot be negative'),
  frequency: z.string().default('MONTHLY'),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'UPCOMING', 'PAUSED', 'COMPLETED']).default('ACTIVE'),
});

export const memberSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  assignedGroupIds: z.array(z.string()).default([]),
  nomineeName: z.string().min(2, 'Nominee name is required'),
  nomineeRelationship: z.string().min(2, 'Relationship is required'),
  nomineeMobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  notes: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
});

export const paymentSchema = z.object({
  groupId: z.string().min(1, 'Please select a chit group'),
  memberId: z.string().min(1, 'Please select a member'),
  installmentId: z.string().min(1, 'Please select an installment'),
  amount: z.coerce.number().min(1, 'Payment amount must be greater than 0'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMethod: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'OTHER']),
  referenceNumber: z.string().min(2, 'Transaction reference/note required'),
  notes: z.string().optional(),
});

export const payoutSchema = z.object({
  groupId: z.string().min(1, 'Please select a chit group'),
  memberId: z.string().min(1, 'Please select a member'),
  installmentNumber: z.coerce.number().min(1, 'Installment number is required'),
  grossAmount: z.coerce.number().min(1000, 'Gross amount must be valid'),
  discountBidAmount: z.coerce.number().min(0, 'Bid discount cannot be negative'),
  companyCommissionPercent: z.coerce.number().min(0).max(10, 'Commission 0-10%'),
  payoutDate: z.string().min(1, 'Payout date is required'),
  paymentMethod: z.enum(['BANK_TRANSFER', 'CHEQUE', 'UPI', 'CASH']),
  referenceNumber: z.string().min(2, 'Reference number is required'),
  notes: z.string().optional(),
});

