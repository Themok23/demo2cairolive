export interface Location {
  readonly governorate: string | null;
  readonly area: string | null;
  readonly address: string | null;
  readonly latitude: string | null;
  readonly longitude: string | null;
  readonly googleMapsUrl: string | null;
}

export function createLocation(params: Partial<Location>): Location {
  return {
    governorate: params.governorate ?? null,
    area: params.area ?? null,
    address: params.address ?? null,
    latitude: params.latitude ?? null,
    longitude: params.longitude ?? null,
    googleMapsUrl: params.googleMapsUrl ?? null,
  };
}
