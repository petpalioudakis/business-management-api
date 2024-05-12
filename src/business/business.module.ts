import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessStaffController } from './business-staff.controller';
import { Business } from './business.entity';
import { BusinessService } from './business.service';
import { Staff } from './staff.entity';
import { StaffService } from './staff.service';
import { BusinessController } from './business.controller';

/**
 * The BusinessModule is a NestJS module that manages the business-related features of the application.
 * It imports the TypeOrmModule for database interactions and declares the services and controllers related to businesses.
 *
 * @module BusinessModule
 */
@Module({
  // The TypeOrmModule.forFeature method allows to define which repositories are registered in the current scope.
  // Here, it registers the Business and Staff entities.
  imports: [TypeOrmModule.forFeature([Business, Staff])],

  // The providers array is where we can declare the services that this module provides.
  // Here, it provides the BusinessService and StaffService.
  providers: [BusinessService, StaffService],

  // The controllers array is where we can declare the controllers that should be instantiated by this module.
  // Here, it instantiates the BusinessController and BusinessStaffController.
  controllers: [BusinessController, BusinessStaffController],
})
export class BusinessModule {}
