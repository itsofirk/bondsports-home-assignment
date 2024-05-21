import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  transactionId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column('decimal')
  value: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  transactionDate: Date;
}
