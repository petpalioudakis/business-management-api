import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './business.entity';
import { CreateStaffDto } from './input/create-staff.dto';
import { UpdateStaffDto } from './input/update-staff.dto';
import { Staff } from './staff.entity';

/**
 * StaffService is a service that provides methods to manage staff.
 */
@Injectable()
export class StaffService {
  /**
   * Constructor for StaffService.
   * @param {Repository<Staff>} staffRepository - The repository for Staff entities.
   */
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  /**
   * Find all staff for a given business.
   * @param {number} business_id - The ID of the business.
   * @returns {Promise<Staff[]>} A promise that resolves to an array of Staff entities.
   */
  async findAllByBusiness(business_id: number): Promise<Staff[]> {
    return await this.staffRepository.find({
      relations: {
        business: true,
      },
      where: { business: { id: business_id } },
    });
  }

  /**
   * Find all staff members without a business.
   */
  async findAll(): Promise<Staff[]> {
    return await this.staffRepository.find({
      relations: {
        business: true,
      },
    });
  }

  /**
   * Find a staff member by their ID.
   * @param {number} id - The ID of the staff member.
   * @returns {Promise<Staff>} A promise that resolves to a Staff entity.
   */
  async findOne(id: number): Promise<Staff> {
    return await this.staffRepository.findOne({
      where: { id },
      relations: ['business'],
    });
  }

  /**
   * Create a new staff member.
   * @param {CreateStaffDto} input - The data to create the staff member.
   * @param {Business} business - The business the staff member belongs to.
   * @returns {Promise<Staff>} A promise that resolves to the created Staff entity.
   */
  async create(input: CreateStaffDto, business: Business): Promise<Staff> {
    const staff = new Staff({
      ...input,
      business,
    });

    return await this.staffRepository.save(staff);
  }

  /**
   * Update a staff member.
   * @param {Staff} staff - The staff member to update.
   * @param {UpdateStaffDto} input - The data to update the staff member.
   * @returns {Promise<Staff>} A promise that resolves to the updated Staff entity.
   */
  async update(staff: Staff, input: UpdateStaffDto): Promise<Staff> {
    const result = await this.staffRepository.save(
      new Staff({
        ...staff,
        ...input,
      }),
    );
    return result;
  }

  /**
   * Remove a staff member.
   * @param {number} id - The ID of the staff member to remove.
   * @returns {Promise<void>} A promise that resolves when the staff member has been removed.
   */
  async remove(id: number): Promise<void> {
    await this.staffRepository.delete(id);
  }
}
