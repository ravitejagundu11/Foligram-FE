export interface AppointmentBooker {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  profilePicture?: string;
}

export interface Appointment {
  id: string;
  portfolioId: string;
  portfolioOwnerId: string;
  portfolioOwnerName: string;
  booker: AppointmentBooker;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'pending' | 'approved' | 'cancelled' | 'completed';
  meetingLink?: string;
  zoomMeetingId?: string;
  notes?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  portfolioId: string;
  date: string;
  time: string;
  duration: number;
  bookerName: string;
  bookerEmail: string;
  bookerPhone?: string;
  bookerCompany?: string;
  bookerRole?: string;
  reason?: string;
}

export interface AppointmentSlot {
  date: string;
  time: string;
  available: boolean;
}
