import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Order } from "../order";
import { OrderItem } from "../order/order-item";

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false, type: "float" })
  public amount: number;

  @JoinColumn()
  @ManyToOne(type => Order, { nullable: false })
  public order: Order;

  @JoinColumn()
  @OneToMany(type => OrderItem, item => item.invoice)
  public items: OrderItem[];

  @Column({ nullable: false })
  public isCouponApplied: boolean;

  @Column({ nullable: true })
  public appliedCouponCode: string;
}
