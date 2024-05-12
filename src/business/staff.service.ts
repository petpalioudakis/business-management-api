import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './business.entity';
import { CreateStaffDto } from './input/create-staff.dto';
import { UpdateStaffDto } from './input/update-staff.dto';
import { Staff } from './staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  /**
   * Find all staff
   */
  async findAll(business_id: number): Promise<Staff[]> {
    return await this.staffRepository.find({
      relations: {
        business: true,
      },
      where: { business: { id: business_id } },
    });
  }

  /**
   * Find a staff by id
   * @param id
   */
  async findOne(id: number): Promise<Staff> {
    return await this.staffRepository.findOneBy({ id });
  }

  /**
   * Create a staff
   * @param input
   * @param business
   */
  async create(input: CreateStaffDto, business: Business): Promise<Staff> {
    const staff = new Staff({
      ...input,
      business,
    });

    return await this.staffRepository.save(staff);
  }

  /**
   * Update a staff
   * @param staff
   * @param input
   */
  async update(staff: Staff, input: UpdateStaffDto): Promise<Staff> {
    return await this.staffRepository.save(
      new Staff({
        ...staff,
        ...input,
      }),
    );
  }

  /**
   * Remove a staff
   * @param id
   */
  async remove(id: number): Promise<void> {
    await this.staffRepository.delete(id);
  }
}
