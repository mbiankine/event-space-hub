
export interface Space {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    state: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    zipCode?: string;
    country?: string;
  };
  capacity: number;
  space_type: string;
  images: string[] | null;
  created_at: string;
  pricing_type?: string;
  hourly_price?: number;
  availability?: string[];
  amenities?: string[];
  custom_amenities?: CustomAmenity[];
  host_id: string;
}

export interface CustomAmenity {
  name: string;
  price: number;
  description?: string;
}
