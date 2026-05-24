export type Role = 'student' | 'organizer' | 'admin';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  status?: 'active' | 'invited';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  is_free: boolean;
  price?: number;
  poster_url?: string;
  qr_code_url?: string;
  organizer_name: string;
  created_at: string;
  status: 'published' | 'draft';
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  status: 'pending' | 'confirmed' | 'rejected';
  payment_screenshot_url?: string;
  created_at: string;
  event?: Event;
}

export interface Organizer {
  id: string;
  name: string;
  email: string;
  club_name: string;
  status: 'active' | 'invited';
  joined_at?: string;
}
