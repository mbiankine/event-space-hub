
export interface Location {
  city: string;
  state: string;
}

export interface SpaceWithLocation {
  location: {
    city: string;
    state: string;
    [key: string]: any; // Allow other location properties
  };
  [key: string]: any; // Allow other space properties
}
