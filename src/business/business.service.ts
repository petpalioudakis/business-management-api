import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Business } from './business.entity';
import { CreateBusinessDto } from './input/create-business.dto';
import { UpdateBusinessDto } from './input/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  /**
   * Find all businesses
   */
  async findAll(): Promise<Business[]> {
    return await this.businessRepository.find();
  }

  /**
   * Find a business by id
   * @param id
   */
  async findOne(id: number): Promise<Business> {
    const business = await this.businessRepository.findOneBy({ id });
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    return business;
  }

  /**
   * Create a business
   * @param input
   */
  async create(input: CreateBusinessDto): Promise<Business> {
    return await this.businessRepository.save(
      new Business({
        ...input,
      }),
    );
  }

  /**
   * Update a business
   * @param business
   * @param input
   */
  async update(
    business: Business,
    input: UpdateBusinessDto,
  ): Promise<Business> {
    return await this.businessRepository.save(
      new Business({
        ...business,
        ...input,
      }),
    );
  }

  /**
   * Remove a business
   * @param id
   */
  async remove(id: number): Promise<DeleteResult> {
    return this.businessRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
