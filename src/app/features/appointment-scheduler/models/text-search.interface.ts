export interface ITextSearch {
  results: ISearchResults[];
}
interface ISearchResults {
  address_components: IAddressComponents[];
  formatted_address: string;
  geometry: IGeometry;
}

interface IAddressComponents {
  long_name: string;
  short_name: string;
  types: string[];
}

interface IGeometry {
  location: ILocation;
}
export interface ILocation {
  lat: number;
  lng: number;
}
