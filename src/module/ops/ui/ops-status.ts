import type {
  ServiceType,
  RequestStatus,
  PaymentStatus,
  PaymentMethod,
  RequestSource,
} from '../types';

// ----------------------------------------------------------------------

type ChipColor = 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export const STATUS_COLOR: Record<RequestStatus, ChipColor> = {
  new: 'warning',
  in_progress: 'info',
  confirmed: 'info',
  assigned: 'secondary',
  on_the_way: 'primary',
  completed: 'success',
  paid: 'success',
  cancelled: 'error',
  not_reached: 'error',
  rescheduled: 'warning',
};

export const PAYMENT_COLOR: Record<PaymentStatus, ChipColor> = {
  unpaid: 'default',
  awaiting: 'warning',
  paid: 'success',
};

export const SERVICE_COLOR: Record<ServiceType, ChipColor> = {
  doctor: 'primary',
  nurse: 'info',
  nanny: 'secondary',
};

export const ALL_STATUSES: RequestStatus[] = [
  'new',
  'in_progress',
  'confirmed',
  'assigned',
  'on_the_way',
  'completed',
  'paid',
  'cancelled',
  'not_reached',
  'rescheduled',
];

export const SERVICE_TYPES: ServiceType[] = ['doctor', 'nurse', 'nanny'];

export const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'card', 'click', 'payme'];

export const SOURCES: RequestSource[] = ['website', 'ios', 'phone', 'instagram'];

// ----------------------------------------------------------------------
// Status machine (spec 5.4)
// Forward: new → in_progress → confirmed → assigned → on_the_way → completed → paid
// Any live status may branch to cancelled / not_reached / rescheduled (reason required).
// rescheduled re-enters the flow at in_progress.
// ----------------------------------------------------------------------

const FORWARD: Record<RequestStatus, RequestStatus | null> = {
  new: 'in_progress',
  in_progress: 'confirmed',
  confirmed: 'assigned',
  assigned: 'on_the_way',
  on_the_way: 'completed',
  completed: 'paid',
  paid: null,
  cancelled: null,
  not_reached: null,
  rescheduled: 'in_progress',
};

const CLOSED: RequestStatus[] = ['paid', 'cancelled', 'not_reached'];

export function isClosed(status: RequestStatus): boolean {
  return CLOSED.includes(status);
}

/** Valid target statuses from the current one, forward step first. */
export function getAllowedTransitions(current: RequestStatus): RequestStatus[] {
  const targets: RequestStatus[] = [];

  const forward = FORWARD[current];
  if (forward) targets.push(forward);

  if (!isClosed(current)) {
    (['cancelled', 'not_reached', 'rescheduled'] as RequestStatus[]).forEach((s) => {
      if (s !== current && !targets.includes(s)) targets.push(s);
    });
  }

  return targets;
}
