import { Test, TestingModule } from '@nestjs/testing';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { NotFoundException } from '@nestjs/common';
import { BusinessType } from './input/bussinessType';
import { CreateBusinessDto } from './input/create-business.dto';
import { UpdateBusinessDto } from './input/update-business.dto';

describe('BusinessController', () => {
  let controller: BusinessController;
  let service: BusinessService;
  let input: CreateBusinessDto;
  let updateInput: UpdateBusinessDto;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [
        {
          provide: BusinessService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
            create: jest.fn().mockResolvedValue({ id: 2 }),
            update: jest.fn().mockResolvedValue({ id: 3 }),
            remove: jest.fn().mockResolvedValue({ id: 4 }),
          },
        },
      ],
    }).compile();

    controller = module.get<BusinessController>(BusinessController);
    service = module.get<BusinessService>(BusinessService);
    input = {
      name: 'Business Name',
      location: 'Business Location',
      business_type: BusinessType.RESTAURANT,
    };
    updateInput = {
      name: 'New Business Name',
      location: 'New Business Location',
      business_type: BusinessType.RESTAURANT,
    };
  });

  it('should return all businesses', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a business by ID', async () => {
    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should throw an error if business not found', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockImplementation(() => Promise.resolve(null));
    await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should create a business', async () => {
    await controller.create(input);
    expect(service.create).toHaveBeenCalledWith(input);
  });

  it('should update a business', async () => {
    await controller.update(1, updateInput);
    expect(service.update).toHaveBeenCalledWith({ id: 1 }, updateInput);
  });

  it('should throw an error if business to update not found', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(null);
    await expect(controller.update(1, updateInput)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove a business', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should throw an error if business to remove not found', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(null);
    await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
  });
});
