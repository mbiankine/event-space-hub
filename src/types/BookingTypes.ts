
export interface Booking {
  id: string;
  client_id: string;
  space_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  event_type: string;
  notes?: string;
  status: string;
  payment_status: string;
  payment_method?: string; // Make this property explicitly optional
  total_price: number;
  space_price: number;
  additional_services_price: number;
  service_fee: number;
  created_at: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  space_title: string;
  images?: string[];
  location?: any;
  host_id?: string;
  host_name?: string;
  spaces?: {
    title: string;
    images?: string[];
    location?: any;
    host_id?: string;
  };
}
