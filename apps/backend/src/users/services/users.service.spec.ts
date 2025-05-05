jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed_password')),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { select, UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { User } from '@generated/prisma/client';


describe('UsersService', () => {
  let service: UsersService;

  const now = new Date();

  const mockUser: User = {
    id: 1,
    name: 'Davi',
    email: 'davi@email.com',
    password: 'hashed_password',
    createdAt: now,
    updatedAt: now,
  };

  const mockPrisma = {
    user: {
      create: jest.fn().mockResolvedValue(mockUser),
      findMany: jest.fn().mockResolvedValue([mockUser]),
      findUnique: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
      delete: jest.fn().mockResolvedValue(mockUser),
    },
  };

  const mockRedis = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // limpa mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    };

    const result = await service.create(dto);

    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: dto, select });
  });

  it('should return all all users from DB', async () => {
    mockRedis.get.mockResolvedValue(null);

    const result = await service.findAll();

    expect(result).toEqual([mockUser]);
    expect(mockPrisma.user.findMany).toHaveBeenCalled();
    expect(mockRedis.set).toHaveBeenCalled();
  });

  it('should return a user by id from DB caso dont have cache', async () => {
    mockRedis.get.mockResolvedValue(null);

    const result = await service.findOne(1);

    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select,
    });
    expect(mockRedis.set).toHaveBeenCalledWith(
      'user:1',
      JSON.stringify(mockUser),
      120,
    );
  });

  it('should update user and clear cache', async () => {
    const dto: UpdateUserDto = { name: 'Atualizado', email: 'novo@email.com' };
    const result = await service.update(1, dto);

    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
      select,
    });
    expect(mockRedis.del).toHaveBeenCalledWith('user:1');
    expect(mockRedis.del).toHaveBeenCalledWith('users');
  });

  it('should delete user and clear cache', async () => {
    const result = await service.remove(1);

    expect(result).toEqual(mockUser);
    expect(mockPrisma.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
      select,
    });
    expect(mockRedis.del).toHaveBeenCalledWith('user:1');
    expect(mockRedis.del).toHaveBeenCalledWith('users');
  });
});
