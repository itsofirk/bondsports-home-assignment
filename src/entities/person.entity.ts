import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  personId: number;

  @Column()
  name: string;

  @Column()
  document: string;

  @Column({ nullable: true })
  birthDate: Date;
}
