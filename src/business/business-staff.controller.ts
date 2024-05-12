import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
import { BusinessService } from './business.service';
import { CreateStaffDto } from './input/create-staff.dto';
import { UpdateStaffDto } from './input/update-staff.dto';
import { Staff } from './staff.entity';
import { StaffService } from './staff.service';

/**
 * The BusinessStaffController is a controller that handles HTTP requests related to staff of a business.
 * It uses the StaffService and BusinessService to perform operations.
 *
 * @class BusinessStaffController
 */
@Controller('business/:businessId/staff')
@UseGuards(AuthGuardJwt)
export class BusinessStaffController {
  /**
   * Logger instance to log information, warnings, errors etc.
   *
   * @private
   * @type {Logger}
   */
  private readonly logger = new Logger(BusinessStaffController.name);

  /**
   * Creates an instance of BusinessStaffController.
   *
   * @param {StaffService} staffService - An instance of StaffService.
   * @param {BusinessService} businessService - An instance of BusinessService.
   */
  constructor(
    private readonly staffService: StaffService,
    private readonly businessService: BusinessService,
  ) {}

  /**
   * Handles the GET /business/:businessId/staff request.
   * Returns all staff of a business.
   *
   * @param {number} businessId - The ID of the business.
   * @returns {Promise<Staff[]>} The staff of the business.
   */
  @Get()
  async findAll(
    @Param('businessId', ParseIntPipe) businessId: number,
  ): Promise<Staff[]> {
    const business = await this.businessService.findOne(businessId);
    if (!business) {
      this.logger.debug(`Business with id ${businessId} not found`);
      throw new NotFoundException('Business not found');
    }
    return await this.staffService.findAll(businessId);
  }

  /**
   * Handles the GET /business/:businessId/staff/:id request.
   * Returns a staff member by ID.
   *
   * @param {number} id - The ID of the staff member.
   * @returns {Promise<Staff>} The staff member.
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Staff> {
    const staff = await this.staffService.findOne(id);
    if (!staff) {
      this.logger.debug(`Staff with id ${id} not found`);
      throw new NotFoundException('Staff not found');
    }
    return staff;
  }

  /**
   * Handles the POST /business/:businessId/staff request.
   * Creates a new staff member.
   *
   * @param {number} businessId - The ID of the business.
   * @param {CreateStaffDto} input - The data to create the staff member.
   * @returns {Promise<Staff>} The created staff member.
   */
  @Post()
  async create(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Body() input: CreateStaffDto,
  ): Promise<Staff> {
    const business = await this.businessService.findOne(businessId);
    if (!business) {
      this.logger.debug(`Business with id ${businessId} not found`);
      throw new NotFoundException('Business not found');
    }
    return await this.staffService.create(input, business);
  }

  /**
   * Handles the PATCH /business/:businessId/staff/:id request.
   * Updates a staff member.
   *
   * @param {number} id - The ID of the staff member.
   * @param {UpdateStaffDto} input - The data to update the staff member.
   * @returns {Promise<Staff>} The updated staff member.
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateStaffDto,
  ): Promise<Staff> {
    const staff = await this.staffService.findOne(id);
    if (!staff) {
      this.logger.debug(`Staff with id ${id} not found`);
      throw new NotFoundException('Staff not found');
    }
    return await this.staffService.update(staff, input);
  }

  /**
   * Handles the DELETE /business/:businessId/staff/:id request.
   * Deletes a staff member.
   *
   * @param {number} id - The ID of the staff member.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const staff = await this.staffService.findOne(id);
    if (!staff) {
      this.logger.debug(`Staff with id ${id} not found`);
      throw new NotFoundException('Staff not found');
    }
    await this.staffService.remove(id);
  }
}
