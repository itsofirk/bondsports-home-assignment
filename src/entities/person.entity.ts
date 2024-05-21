import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  personId: number;

  @Column()
  name: string;

  @Column()
  document: string;

  @Column('date')
  birthDate: Date;
}