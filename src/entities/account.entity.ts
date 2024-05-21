import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Person } from './person.entity';
import { DecimalColumn } from 'src/common/decorators/decimal-column.decorator';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('increment')
  accountId: number;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'personId' })
  person: Person;

  @DecimalColumn()
  balance: number;

  @DecimalColumn()
  dailyWithdrawalLimit: number;

  @Column()
  activeFlag: boolean;

  @Column('int')
  accountType: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createDate: Date;
}
