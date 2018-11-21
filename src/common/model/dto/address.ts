import {Required} from "../../annotations";

export module address {

	export class DeleteAddressRequest {

		@Required()
		public addressId: number;

	}

	export class CreateAddressRequest {

		public googlePlaceId?: string;
		public coordinates?: {
			latitude: number;
			longitude: number;
		}

	}

	export interface IAddress {
		streetName: string;
		streetNumber: string;
		city: string;
		country: string;
		zipCode: string;
		formattedAddress: string;
	}

	export class Address {

		public streetName: string;
		public streetNumber: string;
		public city: string;
		public country: string;
		public zipCode: string;
		public formattedAddress: string;

		constructor(address: IAddress) {
			this.streetName = address.streetName;
			this.streetNumber = address.streetNumber;
			this.city = address.city;
			this.zipCode = address.zipCode;
			this.country = address.country;
			this.formattedAddress = address.formattedAddress;
		}

	}

}