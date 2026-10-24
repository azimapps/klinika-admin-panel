// ----------------------------------------------------------------------
// HOMEMED operator panel types (see docs/HOMEMED_API.md §2-5)
// ----------------------------------------------------------------------

export type ServiceType = 'doctor' | 'nurse' | 'nanny';

export type RequestStatus =
  | 'new'
  | 'in_progress'
  | 'confirmed'
  | 'assigned'
  | 'on_the_way'
  | 'completed'
  | 'paid'
  | 'cancelled'
  | 'not_reached'
  | 'rescheduled';

export type PaymentStatus = 'unpaid' | 'awaiting' | 'paid';

export type PaymentMethod = 'cash' | 'card' | 'click' | 'payme';

export type RequestSource = 'website' | 'ios' | 'phone' | 'instagram';

export type Sex = 'male' | 'female';

/** Statuses that require a reason when transitioning into them. */
export const REASON_REQUIRED_STATUSES: RequestStatus[] = [
  'cancelled',
  'not_reached',
  'rescheduled',
];

// ----------------------------------------------------------------------

export interface IOpsRequestListItem {
  id: number;
  request_number: string;
  created_at: string;
  visit_at: string | null;
  service_type: ServiceType;
  full_name: string;
  phone: string;
  district: string | null;
  district_id: number | null;
  status: RequestStatus;
  operator: string | null;
  assigned_operator_id: number | null;
  specialist: string | null;
  assigned_specialist_id: number | null;
  amount: number | null;
  payment_status: PaymentStatus;
  source: RequestSource;
  is_overdue: boolean;
}

/** The full patient-record fields (readable in detail, writable via PATCH). */
export interface IOpsPatientRecord {
  birth_date: string | null;
  sex: Sex | null;
  extra_phone: string | null;
  contact_person: string | null;
  street: string | null;
  building: string | null;
  apartment: string | null;
  entrance: string | null;
  floor: string | null;
  landmark: string | null;
  geo_lat: number | null;
  geo_lng: number | null;
  specialty: string | null;
  urgency: string | null;
  complaints: string | null;
  temperature: string | null;
  blood_pressure: string | null;
  chronic_conditions: string | null;
  allergies: string | null;
  current_medication: string | null;
  child_age: string | null;
  num_children: number | null;
  duration: string | null;
  special_requirements: string | null;
  payment_method: PaymentMethod | null;
  operator_comment: string | null;
}

export interface IOpsRequestDetail extends IOpsRequestListItem, IOpsPatientRecord {
  // read-only
  cancel_reason: string | null;
  consent_accepted?: boolean;
  consent_at?: string | null;
  consent_offer_version?: number | null;
  consent_source?: string | null;
}

/** PATCH /ops/requests/{id} — any subset. `price` maps to the stored amount. */
export interface IOpsRequestUpdate extends Partial<IOpsPatientRecord> {
  district_id?: number | null;
  visit_at?: string | null;
  price?: number | null;
}

export interface IOpsRequestCreate {
  full_name: string;
  phone: string;
  service_type: ServiceType;
  district_id?: number | null;
  visit_at?: string | null;
  operator_comment?: string | null;
}

// ----------------------------------------------------------------------

export interface IOpsListParams {
  status?: RequestStatus;
  service?: ServiceType;
  operator_id?: number;
  district_id?: number;
  specialist_id?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface IOpsListResponse {
  total: number;
  limit: number;
  offset: number;
  items: IOpsRequestListItem[];
}

export interface IOpsNewCount {
  new: number;
}

export interface IStatusChange {
  status: RequestStatus;
  reason?: string;
}

export interface IAssignResponse extends IOpsRequestDetail {
  specialist_notified: boolean;
}

export interface IStatusHistoryEntry {
  from: RequestStatus | null;
  to: RequestStatus;
  reason: string | null;
  changed_by_id: number | null;
  at: string;
}

export interface IPaymentLinkParams {
  method: 'payme' | 'click' | 'both';
  channel: 'link' | 'telegram';
  chat_id?: string;
}

export interface IPaymentLinkResponse {
  links: { payme?: string; click?: string };
  payment_status: PaymentStatus;
  telegram_sent: boolean;
}

export interface IPaymentMarkParams {
  payment_status: PaymentStatus;
  method?: PaymentMethod;
}

export interface IClientLookupHistory {
  id: number;
  request_number: string;
  created_at: string;
  service_type: ServiceType;
  status: RequestStatus;
  amount: number | null;
}

export interface IClientLookupResponse {
  phone: string;
  known_client: boolean;
  client_id: number | null;
  prefill: Partial<IOpsPatientRecord & { full_name: string }> | null;
  history: IClientLookupHistory[];
}

export interface IDistrict {
  id: number;
  name_uz: string;
  name_ru: string;
  is_active: boolean;
}
