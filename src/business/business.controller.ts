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
import { Business } from './business.entity';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './input/create-business.dto';
import { UpdateBusinessDto } from './input/update-business.dto';

/**
 * The BusinessController is a controller that handles HTTP requests related to businesses.
 * It uses the BusinessService to perform operations.
 *
 * @class BusinessController
 */
@Controller('/business')
export class BusinessController {
  /**
   * Logger instance to log information, warnings, errors etc.
   *
   * @private
   * @type {Logger}
   */
  private readonly logger = new Logger(BusinessController.name);

  /**
   * Creates an instance of BusinessController.
   *
   * @param {BusinessService} businessService - An instance of BusinessService.
   */
  constructor(private readonly businessService: BusinessService) {}

  /**
   * Handles the GET /business request.
   * Returns all businesses.
   *
   * @returns {Promise<Business[]>} The businesses.
   */
  @Get()
  async findAll(): Promise<Business[]> {
    return await this.businessService.findAll();
  }

  /**
   * Handles the GET /business/:id request.
   * Returns a business by ID.
   *
   * @param {number} id - The ID of the business.
   * @returns {Promise<Business>} The business.
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Business> {
    const business = await this.businessService.findOne(id);
    if (!business) {
      this.logger.debug(`Business with id ${id} not found`);
      throw new NotFoundException('Business not found');
    }
    return business;
  }

  /**
   * Handles the POST /business request.
   * Creates a new business.
   *
   * @param {CreateBusinessDto} input - The data to create the business.
   * @returns {Promise<Business>} The created business.
   */
  @Post()
  @UseGuards(AuthGuardJwt)
  async create(@Body() input: CreateBusinessDto): Promise<Business> {
    return await this.businessService.create(input);
  }

  /**
   * Handles the PATCH /business/:id request.
   * Updates a business.
   *
   * @param {number} id - The ID of the business.
   * @param {UpdateBusinessDto} input - The data to update the business.
   * @returns {Promise<Business>} The updated business.
   */
  @Patch(':id')
  @UseGuards(AuthGuardJwt)
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

  /**
   * Handles the DELETE /business/:id request.
   * Deletes a business.
   *
   * @param {number} id - The ID of the business.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  @UseGuards(AuthGuardJwt)
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
