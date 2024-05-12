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
import { Business } from './business.entity';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './input/create-business.dto';
import { UpdateBusinessDto } from './input/update-business.dto';

@Controller('/business')
export class BusinessController {
  private readonly logger = new Logger(BusinessController.name);
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  async findAll(): Promise<Business[]> {
    return await this.businessService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Business> {
    const business = await this.businessService.findOne(id);
    if (!business) {
      this.logger.debug(`Business with id ${id} not found`);
      throw new NotFoundException('Business not found');
    }
    return business;
  }

  @Post()
  async create(@Body() input: CreateBusinessDto): Promise<Business> {
    return await this.businessService.create(input);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateBusinessDto,
  ): Promise<Business> {
    const business: Business = await this.businessService.findOne(id);
    if (!business) {
      this.logger.debug(`Business with id ${id} not found`);
      throw new NotFoundException('Business not found');
    }
    return await this.businessService.update(business, input);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const business: Business = await this.businessService.findOne(id);
    if (!business) {
      this.logger.debug(`Business with id ${id} not found`);
      throw new NotFoundException('Business not found');
    }
    await this.businessService.remove(id);
  }
}
