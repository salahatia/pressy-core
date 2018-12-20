import {SlotType} from '../entity/slot';
import {Required} from "../../annotations";

export interface ISlot {
	id: number;
	type: SlotType;
	startDate: Date;
}

export class Slot {

	public id: number;
	public type?: string;
	public startDate: Date;

	constructor(slot: ISlot) {
		this.id = slot.id;
		this.type = SlotType.toString(slot.type);
		this.startDate = slot.startDate;
	}

}

export interface ICreateSlotRequest {
	startDate: Date;
	type: SlotType;
	availableDrivers: number;
}

export class CreateSlotRequest {

	@Required()
	public startDate: Date;

	@Required()
	public type: SlotType;

	@Required()
	public availableDrivers: number;

	constructor(request: ICreateSlotRequest) {
		this.startDate = request.startDate;
		this.type = request.type;
		this.availableDrivers = request.availableDrivers;
	}

}