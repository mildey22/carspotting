export interface ICar {
  make?: string;
  model?: string;
  generation?: string;
  color: string;
  image?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  userId?: string;
}
