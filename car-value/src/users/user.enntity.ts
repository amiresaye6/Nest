import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(`new user was added to the database. with id: ${this.id}`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`user ${this.id} was removed successfully`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`user ${this.id} was updated successfully`);
  }
}
