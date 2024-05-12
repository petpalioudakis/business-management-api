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
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateStaffDto } from './input/create-staff.dto';
import { UpdateStaffDto } from './input/update-staff.dto';
import { Staff } from './staff.entity';
import { StaffService } from './staff.service';

@Controller('business/:businessId/staff')
export class BusinessStaffController {
  private readonly logger = new Logger(BusinessStaffController.name);

  constructor(
    private readonly staffService: StaffService,
    private readonly businessService: BusinessService,
  ) {}

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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Staff> {
    const staff = await this.staffService.findOne(id);
    if (!staff) {
      this.logger.debug(`Staff with id ${id} not found`);
      throw new NotFoundException('Staff not found');
    }
    return staff;
  }

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
