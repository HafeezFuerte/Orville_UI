export interface AmenityColumnDef {
  key: string;
  label: string;
  visible: boolean;
}

export interface AmenityRow {
  id: number;
  name: string;
  isDefault: boolean;
}

export interface AmenityDraft {
  name: string;
}

export const EMPTY_AMENITY: AmenityDraft = {
  name: '',
};

/**
 * Sample amenities matching the Property Amenities screenshot.
 * Sorted by name asc → first page shows Built-in Kitchen… through Private Garden.
 */
export const DEFAULT_PROPERTY_AMENITIES: AmenityRow[] = [
  { id: 2, name: 'Built in Kitchen Appliances', isDefault: true },
  { id: 3, name: 'Built in Wardrobes', isDefault: true },
  { id: 4, name: 'Central A/C & Heating', isDefault: true },
  { id: 22, name: 'Chiller', isDefault: true },
  { id: 5, name: 'Concierge Service', isDefault: true },
  { id: 6, name: 'Covered Parking', isDefault: true },
  { id: 8, name: 'Maid Service', isDefault: true },
  { id: 9, name: 'Maids Room', isDefault: true },
  { id: 10, name: 'Pets Allowed', isDefault: true },
  { id: 11, name: 'Private Garden', isDefault: true },
  { id: 12, name: 'Security', isDefault: true },
  { id: 13, name: 'Shared Pool', isDefault: true },
  { id: 14, name: 'Spa', isDefault: true },
  { id: 15, name: 'Storage Room', isDefault: true },
  { id: 16, name: 'Study Room', isDefault: true },
  { id: 17, name: 'Swimming Pool', isDefault: true },
  { id: 18, name: 'Tennis Court', isDefault: true },
  { id: 19, name: 'Underground Parking', isDefault: true },
  { id: 7, name: 'Visitor Parking', isDefault: true },
  { id: 20, name: 'Walk-in Closet', isDefault: true },
  { id: 21, name: 'Wi-Fi', isDefault: true },
];
