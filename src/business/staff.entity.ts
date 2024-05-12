import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from './business.entity';
import { JobPositionType } from './input/jobPositionType';

@Entity('staff')
export class Staff {
  constructor(partial: Partial<Staff>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  last_name: string;
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: JobPositionType,
    nullable: false,
  })
  job_position: JobPositionType;

  @ManyToOne(() => Business, (business) => business.staff, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone_number: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' }) // Set the default value to the current timestamp
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }) // Set the default value to the current timestamp and update it on every update
  updated_at: Date;
}
