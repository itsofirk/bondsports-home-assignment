import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Account } from './account.entity';

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn()
  personId: number;

  @Column()
  name: string;

  @Column()
  document: string;

  @Column({ nullable: true })
  birthDate: Date;

  @OneToMany(() => Account, account => account.person)
  accounts: Account[];
}
