import { AddressComponentType } from "src/app/shared/api-models/google-models/google-address-component-type.enum";
import { ILaviAddress } from "src/app/shared/api-models/google-models/lavi-address.interface";
import { GoogleTimezoneResponse } from "src/app/shared/api-models/google-models/timezone-response";
import { LocationAPIService } from "src/app/shared/api-services/location-api.service";
import { Address } from "src/app/shared/directives/google-address-auto-complete/objects/address";
import { AddressComponent } from "src/app/shared/directives/google-address-auto-complete/objects/addressComponent";

export async function ResolveAddress(
    address: Address,
    locationAPIService: LocationAPIService
  ): Promise<ILaviAddress> {
    let laviAddress: ILaviAddress = {
      countryId: '',
      latitude: 0,
      longitude: 0,
      stateId: '',
      timeZoneId: '',
      zipCode: '',
      googlePlaceId: '',
      formattedAddress: '',
    };
  
    laviAddress.googlePlaceId = address.place_id;
    laviAddress.latitude = address.geometry.location.lat();
    laviAddress.longitude = address.geometry.location.lng();
  
    let timeZone: GoogleTimezoneResponse =
      await locationAPIService.GetTimezoneByLatitudeAndLongitude(
        laviAddress.latitude,
        laviAddress.longitude
      );
  
    laviAddress.timeZoneId = timeZone.timeZoneId;
  
    // Assign country
    const country: AddressComponent = GetCountry(address);
    const ISO2CountryCode = country.short_name;
    laviAddress.countryId = await ResolveISO3Code(ISO2CountryCode); 
  
    // Assign state
    const State: AddressComponent = GetState(address);
    const StateCode = State?.short_name;
    laviAddress.stateId = StateCode; // two characters code
  
    //assign postal_code
    const PostalCode: AddressComponent = GetPostalCode(address);
    laviAddress.zipCode = PostalCode?.long_name;
  
    laviAddress.formattedAddress = address.formatted_address;
  
    return Promise.resolve(laviAddress);
  }
  
  function GetCountry(address: any): AddressComponent {
    let countryComponent = GetAddressComponentByType(
      address.address_components,
      AddressComponentType.country
    );
    return countryComponent;
  }
  
  function GetState(address: Address): AddressComponent {
    let stateComponent = GetAddressComponentByType(
      address.address_components,
      AddressComponentType.administrative_area_level_1
    );
    return stateComponent;
  }
  
  function GetAddressComponentByType(
    address_components: AddressComponent[],
    type: AddressComponentType
  ) {
    let Component = address_components.find((c) =>
      c.types.some((x) => x == type)
    );
    return Component;
  }
  
  function GetPostalCode(address: Address): AddressComponent {
    let stateComponent = GetAddressComponentByType(
      address.address_components,
      AddressComponentType.postal_code
    );
    return stateComponent;
  }
  
  async function ResolveISO3Code(ISO2CountryCode: string): Promise<string> {
    var countries = require('i18n-iso-countries');
    const alpha3 = countries.alpha2ToAlpha3(ISO2CountryCode);
    return Promise.resolve(alpha3);
  }
  