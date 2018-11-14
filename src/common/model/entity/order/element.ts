import { Order } from './index';
import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column,} from "typeorm";
import * as DTO from "../../dto";

export enum ElementType {
  SHIRT = 1,
  TSHIRT = 2,
  PANT = 4,
  SUIT = 8,
  UNDERWEAR = 16,
  SOCKS = 32
}

@Entity()
export class Element {

  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => Order)
  @JoinColumn()
  public order: Order;

  @Column()
  public type: ElementType;

  @Column({nullable: true})
  public color: string;

  @Column({nullable: true})
  public comment?: string;

  public static create(booking: Order, element: DTO.order.CreateOrderElementRequest): Element {

    let elementEntity = new Element;

    elementEntity.order = booking;
    elementEntity.type = element.type;
	  elementEntity.color = element.color;
	  elementEntity.comment = element.comment;

    return elementEntity;

  }
  
}