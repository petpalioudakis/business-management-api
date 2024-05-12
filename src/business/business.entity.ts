import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BusinessType } from './input/bussinessType';
import { Staff } from './staff.entity';

@Entity('businesses')
export class Business {
  constructor(partial: Partial<Business>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  name: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  location: string;

  @Column({
    type: 'enum',
    enum: BusinessType,
    nullable: true,
    default: null,
  })
  business_type: BusinessType;

  @OneToMany(() => Staff, (staff) => staff.business, {
    nullable: false,
  })
  staff: Staff[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' }) // Set the default value to the current timestamp
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }) // Set the default value to the current timestamp and update it on every update
  updated_at: Date;
}
