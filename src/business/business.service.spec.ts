import { Test, TestingModule } from '@nestjs/testing';
import { BusinessService } from './business.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Business } from './business.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BusinessType } from './input/bussinessType';
import { CreateBusinessDto } from './input/create-business.dto';

describe('BusinessService', () => {
  let service: BusinessService;
  let repo: Repository<Business>;
  let business: Business;
  let businessId: number;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessService,
        {
          provide: getRepositoryToken(Business),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BusinessService>(BusinessService);
    repo = module.get<Repository<Business>>(getRepositoryToken(Business));
    businessId = 1;
    business = new Business({ id: businessId });
  });

  it('finds all businesses', async () => {
    jest.spyOn(repo, 'find').mockResolvedValue([business]);

    expect(await service.findAll()).toEqual([business]);
  });

  it('finds a business by id', async () => {
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(business);

    expect(await service.findOne(1)).toEqual(business);
  });

  it('throws an error when business not found', async () => {
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(undefined);

    await expect(service.findOne(1)).rejects.toThrow();
  });

  it('creates a business', async () => {
    const input: CreateBusinessDto = {
      name: 'Business Name',
      location: 'Business Location',
      business_type: BusinessType.RESTAURANT,
    };
    const business = new Business(input);
    business.id = 1;
    jest.spyOn(repo, 'save').mockResolvedValue(business);

    expect(await service.create(input)).toEqual(business);
  });

  it('updates a business', async () => {
    const updatedBusinessData = { name: 'New Business Name' };
    const updatedBusiness = new Business({
      ...business,
      ...updatedBusinessData,
    });

    jest.spyOn(repo, 'findOne').mockResolvedValue(business);
    jest
      .spyOn(repo, 'save')
      .mockImplementation((b: Business) =>
        Promise.resolve({ ...b, ...updatedBusinessData }),
      );

    const result = await service.update(business, updatedBusinessData);

    expect(result.name).toEqual(updatedBusiness.name);
  });

  it('removes a business', async () => {
    const deleteResult = { affected: 1 };
    const deleteQueryBuilder: Partial<SelectQueryBuilder<Business>> = {
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(deleteResult),
    };

    jest
      .spyOn(repo, 'createQueryBuilder')
      .mockReturnValue(deleteQueryBuilder as any);

    expect(await service.remove(1)).toEqual(deleteResult);
  });
});
