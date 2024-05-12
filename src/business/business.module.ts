import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessStaffController } from './business-staff.controller';
import { Business } from './business.entity';
import { BusinessService } from './business.service';
import { Staff } from './staff.entity';
import { StaffService } from './staff.service';
import { BusinessController } from './business.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Business, Staff])],
  providers: [BusinessService, StaffService],
  controllers: [BusinessController, BusinessStaffController],
})
export class BusinessModule {}
