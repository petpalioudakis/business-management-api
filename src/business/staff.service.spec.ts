import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessType } from './input/bussinessType';
import { CreateStaffDto } from './input/create-staff.dto';
import { JobPositionType } from './input/jobPositionType';
import { StaffService } from './staff.service';
import { Staff } from './staff.entity';
import { Business } from './business.entity';

describe('StaffService', () => {
  let service: StaffService;
  let staffRepository: jest.Mocked<Repository<Staff>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: getRepositoryToken(Staff),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
    staffRepository = module.get(getRepositoryToken(Staff));
  });

  it('finds all staff for a business', async () => {
    const business = new Business({
      name: 'Business Name',
      location: 'Business Location',
      business_type: BusinessType.RESTAURANT, // replace with actual business type
      staff: [], // initially empty, staff will be added later
      created_at: new Date(),
      updated_at: new Date(),
    });
    const staff = new Staff({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone_number: '1234567890',
      job_position: JobPositionType.PR,
      business: business, // associate the staff with the business
    });
    staffRepository.find.mockResolvedValue([staff]);

    const result = await service.findAll(business.id);

    expect(result).toEqual([staff]);
    expect(staffRepository.find).toHaveBeenCalledWith({
      relations: { business: true },
      where: { business: { id: business.id } },
    });
  });

  it('finds a staff member by id', async () => {
    const staff = new Staff({ id: 1, first_name: 'John', last_name: 'Doe' });
    staffRepository.findOneBy.mockResolvedValue(staff);

    const result = await service.findOne(staff.id);

    expect(result).toEqual(staff);
    expect(staffRepository.findOneBy).toHaveBeenCalledWith({ id: staff.id });
  });

  it('creates a staff member', async () => {
    const business = new Business({
      name: 'Business Name',
      location: 'Business Location',
      business_type: BusinessType.RESTAURANT,
    });
    const staff = new Staff({
      first_name: 'John',
      last_name: 'Doe',
      email: 'test@tst.gr',
      job_position: JobPositionType.PR,
    });
    staff.business = business;
    staffRepository.save.mockResolvedValue(staff);

    const result = await service.create(
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@tst.gr',
        job_position: JobPositionType.PR,
      } as CreateStaffDto,
      business,
    );

    expect(result).toEqual(staff);
    expect(staffRepository.save).toHaveBeenCalledWith(staff);
  });

  it('updates a staff member', async () => {
    const staff = new Staff({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'test@test.gr',
      job_position: JobPositionType.KITCHEN,
    });
    const updatedStaff = new Staff({
      id: 1,
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'test@test.gr',
      job_position: JobPositionType.KITCHEN,
    });

    staffRepository.findOneBy.mockResolvedValue(staff);
    staffRepository.save.mockResolvedValue(updatedStaff);

    const result = await service.update(staff, {
      first_name: 'Jane',
      last_name: 'Doe',
    });

    expect(result).toEqual(updatedStaff);
    expect(staffRepository.save).toHaveBeenCalledWith(updatedStaff);
  });

  it('removes a staff member', async () => {
    const staff = new Staff({ id: 1, first_name: 'John', last_name: 'Doe' });
    staffRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

    await service.remove(staff.id);

    expect(staffRepository.delete).toHaveBeenCalledWith(staff.id);
  });
});
