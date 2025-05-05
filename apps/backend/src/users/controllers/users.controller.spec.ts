import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { User } from '@generated/prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const now = new Date();

  const mockUser: User = {
    id: 1,
    name: 'Davi',
    email: 'davi@email.com',
    password: 'hashed',
    createdAt: now,
    updatedAt: now,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    };

    jest.spyOn(service, 'create').mockResolvedValue(mockUser);

    expect(await controller.create(dto)).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all users', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([mockUser]);

    expect(await controller.findAll()).toEqual([mockUser]);
  });

  it('should return one user', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

    expect(await controller.findOne('1')).toEqual(mockUser);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { name: 'Atualizado', email: 'novo@email.com' };
    const updatedUser: User = {
      ...mockUser,
      ...dto,
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

    expect(await controller.update('1', dto)).toEqual(updatedUser);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a user', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(mockUser);

    expect(await controller.remove('1')).toEqual(mockUser);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
