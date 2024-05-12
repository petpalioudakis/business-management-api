import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
/**
 * The User entity represents a user in the application.
 * It is a TypeORM entity that maps directly to the 'user' table in the database.
 *
 * @class User
 */
@Entity()
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ unique: true, length: 20, type: 'varchar' })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Expose()
  email: string;

  @Column({ type: 'varchar', length: 100 })
  @Expose()
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  @Expose()
  last_name: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' }) // Set the default value to the current timestamp
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }) // Set the default value to the current timestamp and update it on every update
  updated_at: Date;
}
