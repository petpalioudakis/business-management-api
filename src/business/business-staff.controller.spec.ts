import { Test, TestingModule } from '@nestjs/testing';
import { BusinessStaffController } from './business-staff.controller';
import { JobPositionType } from './input/jobPositionType';
import { StaffService } from './staff.service';
import { BusinessService } from './business.service';
import { NotFoundException } from '@nestjs/common';
import { Staff } from './staff.entity';
import { Business } from './business.entity';
import { CreateStaffDto } from './input/create-staff.dto';
import { UpdateStaffDto } from './input/update-staff.dto';

describe('BusinessStaffController', () => {
  let controller: BusinessStaffController;
  let staffService: StaffService;
  let businessService: BusinessService;
  let businessId: number;
  let staff: Staff;
  let business: Business;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessStaffController],
      providers: [
        {
          provide: StaffService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: BusinessService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BusinessStaffController>(BusinessStaffController);
    staffService = module.get<StaffService>(StaffService);
    businessService = module.get<BusinessService>(BusinessService);
    businessId = 1;
    business = new Business({ id: businessId });
    staff = new Staff({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'test@test.gr',
      job_position: JobPositionType.PR,
    });
  });
  it('finds all staff for a business', async () => {
    jest.spyOn(businessService, 'findOne').mockResolvedValue(business);
    jest.spyOn(staffService, 'findAllByBusiness').mockResolvedValue([staff]);

    expect(await controller.findAllByBusiness(businessId)).toEqual([staff]);
  });

  it('throws an error when business not found', async () => {
    const businessId = 1;
    jest.spyOn(businessService, 'findOne').mockResolvedValue(undefined);

    await expect(controller.findAllByBusiness(businessId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('finds a staff member by id', async () => {
    const id = 1;
    jest.spyOn(staffService, 'findOne').mockResolvedValue(staff);

    expect(await controller.findOne(id)).toEqual(staff);
  });

  it('throws an error when staff not found', async () => {
    const id = 1;
    jest.spyOn(staffService, 'findOne').mockResolvedValue(undefined);

    await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('creates a staff member', async () => {
    const createStaffDto = new CreateStaffDto();
    jest.spyOn(businessService, 'findOne').mockResolvedValue(business);
    jest.spyOn(staffService, 'create').mockResolvedValue(staff);

    expect(await controller.create(businessId, createStaffDto)).toEqual(staff);
  });

  it('updates a staff member', async () => {
    const id = 1;
    const updateStaffDto = new UpdateStaffDto();
    jest.spyOn(staffService, 'findOne').mockResolvedValue(staff);
    jest.spyOn(staffService, 'update').mockResolvedValue(staff);

    expect(await controller.update(id, updateStaffDto)).toEqual(staff);
  });

  it('removes a staff member', async () => {
    const id = 1;
    jest.spyOn(staffService, 'findOne').mockResolvedValue(staff);
    jest.spyOn(staffService, 'remove').mockResolvedValue();

    await expect(controller.remove(id)).resolves.toBeUndefined();
  });
});
