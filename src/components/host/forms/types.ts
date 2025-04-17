
import { CustomAmenity } from "@/types/SpaceTypes";

export interface SpaceFormValues {
  title: string;
  description: string;
  location: {
    zipCode: string;
    street: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city: string;
    state: string;
    country: string;
  };
  pricingType: 'daily' | 'hourly' | 'both';
  price: number;
  hourlyPrice?: number;
  capacity: number;
  spaceType: string;
  amenities: string[];
  customAmenities: string[];
  pricedAmenities?: CustomAmenity[];
  availability: Date[];
  // Updated type to handle both string URLs and File objects in the same array
  images: Array<string | File>;
}
