export interface FilterState {
  price: string;
  guests: string;
  rating: string;
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

export interface PriceOption {
  value: string;
  label: string;
}

export interface GuestsOption {
  value: string;
  label: string;
}

export const PRICE_OPTIONS: PriceOption[] = [
  { value: 'any', label: 'Any' },
  { value: '100', label: '100 NOK' },
  { value: '200', label: '200 NOK' },
  { value: '300', label: '300 NOK' },
  { value: '400', label: '400 NOK' },
  { value: '500', label: '500 NOK' },
];

export const GUEST_OPTIONS: GuestsOption[] = [
  { value: 'any', label: 'Any' },
  { value: '2', label: '2' },
  { value: '4', label: '4' },
  { value: '6', label: '6' },
  { value: '8', label: '8' },
];

export const RATING_OPTIONS = [
  { value: 'any', label: 'Any' },
  ...Array.from({ length: 5 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  })),
];

export const AMENITIES = [
  { key: 'wifi', label: 'WiFi' },
  { key: 'parking', label: 'Parking' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'pets', label: 'Pets' },
] as const;