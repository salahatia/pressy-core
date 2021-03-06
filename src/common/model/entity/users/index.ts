import {Person, PersonActivationStatus} from "./person";
import {JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

export abstract class User {

	@PrimaryGeneratedColumn()
	public id: number;

	@OneToOne(type => Person, {nullable: false})
	@JoinColumn()
	public person: Person;

	public get fullName(): string {
		return `${this.person.firstName} ${this.person.lastName}`;
	}

	public isActive(): boolean {
		return this.person.isPhoneValidated() && this.person.isEmailValidated() && this.person.status != PersonActivationStatus.SUSPENDED;
	}

}