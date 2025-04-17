
export interface Booking {
  id: string;
  client_id: string;
  host_id: string;
  space_id: string;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  space_title: string | null;
  booking_date: string;
  start_time: string | null;
  end_time: string | null;
  guest_count: number | null;
  event_type: string | null;
  notes: string | null;
  status: string | null;
  payment_status: string | null;
  space_price: number | null;
  additional_services_price: number | null;
  service_fee: number | null;
  total_price: number | null;
  created_at: string | null;
  updated_at: string | null;
  payment_method?: string; // Added this field as optional
}
