// ==========================================
// مُعافى | MUAAFA - Database Types
// Types for all Supabase tables
// ==========================================

export type UserRole = 'individual' | 'business_owner' | 'employee' | 'platform_owner';
export type UserStatus = 'active' | 'suspended' | 'pending' | 'inactive';
export type BusinessType = 'clinic' | 'hospital' | 'pharmacy' | 'lab' | 'delivery' | 'insurance';
export type BusinessStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// ---- Users ----
export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  national_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// ---- Business ----
export interface BusinessRegistration {
  id: string;
  owner_id: string;
  business_name: string;
  business_type: BusinessType;
  commercial_registration: string;
  status: BusinessStatus;
  created_at: string;
  updated_at: string;
}

// ---- Medical Sessions ----
export interface MedicalSession {
  id: string;
  patient_id: string;
  doctor_id?: string;
  business_id?: string;
  status: SessionStatus;
  scheduled_at: string;
  payment_status: PaymentStatus;
  amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ---- Pharmacy Orders ----
export interface PharmacyOrder {
  id: string;
  patient_id: string;
  pharmacy_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  delivery_address?: string;
  created_at: string;
  updated_at: string;
}

// ---- Payment Transactions ----
export interface PaymentTransaction {
  id: string;
  user_id: string;
  reference_id: string;
  reference_type: 'medical_session' | 'pharmacy_order' | 'subscription';
  amount: number;
  status: PaymentStatus;
  payment_method?: string;
  zedpay_transaction_id?: string;
  created_at: string;
  updated_at: string;
}

// ---- Insurance ----
export interface InsurancePolicy {
  id: string;
  user_id: string;
  provider_name: string;
  policy_number: string;
  coverage_percentage: number;
  max_coverage: number;
  expiry_date: string;
  is_active: boolean;
  created_at: string;
}

// ---- Chat ----
export interface ChatConversation {
  id: string;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  image_url?: string;
  created_at: string;
}

// ---- Notifications ----
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  data?: Record<string, unknown>;
  created_at: string;
}
