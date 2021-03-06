import { Address } from "../common/address";
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  Column
} from "typeorm";
import { Slot } from "../slot";
import { Member } from "../users/member";
import { LaundryPartner } from "../users/laundry";
import { PaymentAccount } from "../payment/payment-account";
import { Coupon } from "./coupon";

export enum OrderType {
  PRESSING,
  WEIGHT
}

export interface IOrder {
  paymentAccount: PaymentAccount;
  type: OrderType;
  pickupSlot: Slot;
  deliverySlot: Slot;
  address: Address;
  member: Member;
  laundryPartner?: LaundryPartner;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public created: Date;

  @Column({ nullable: false, default: OrderType.PRESSING })
  public type: OrderType;

  @Column({ nullable: true, unique: true })
  public used_coupon_id: string;

  @ManyToOne(type => Slot, { nullable: false })
  @JoinColumn()
  public pickupSlot: Slot;

  @ManyToOne(type => Slot, { nullable: false })
  @JoinColumn()
  public deliverySlot: Slot;

  @OneToOne(type => Address, { nullable: false })
  @JoinColumn()
  public address: Address;

  @ManyToOne(type => Member, { nullable: false })
  @JoinColumn()
  public member: Member;

  @ManyToOne(type => PaymentAccount, { nullable: false })
  @JoinColumn()
  public paymentAccount: PaymentAccount;

  @ManyToOne(type => LaundryPartner, { nullable: true })
  @JoinColumn()
  public laundryPartner: LaundryPartner;

  @Column({ nullable: false, default: 0 })
  public itemCount: number = 0;

  @Column({ nullable: true, unique: true })
  public stripeOrderId?: string;

  @Column({ nullable: false, default: false })
  public isCouponApplied: boolean;
  public static create(order: IOrder): Order {
    let orderEntity = new Order();

    orderEntity.type = order.type;
    orderEntity.member = order.member;

    orderEntity.pickupSlot = order.pickupSlot;
    orderEntity.deliverySlot = order.deliverySlot;
    orderEntity.address = order.address;
    orderEntity.paymentAccount = order.paymentAccount;

    return orderEntity;
  }
}
