import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from './account.entity';
import { DecimalColumn } from 'src/common/decorators/decimal-column.decorator';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  transactionId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @DecimalColumn()
  value: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  transactionDate: Date;
}
