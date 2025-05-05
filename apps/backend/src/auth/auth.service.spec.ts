/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed')),
  compare: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('jsonwebtoken', () => {
  return {
    ...jest.requireActual('jsonwebtoken'),
    sign: jest.fn(() => 'token'),
    verify: jest.fn(),
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'secret_example';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('registers a new user', async () => {
    const mockUser = {
      id: 1,
      name: 'Test',
      email: 'test@email.com',
      password: 'hashed',
    };
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.register({
      name: 'Test',
      email: 'test@email.com',
      password: 'hashed',
    });

    expect(result).toEqual({
      token: 'token',
      user: {
        id: 1,
        name: 'Test',
        email: 'test@email.com',
        password: 'hashed', // remova se estiver filtrando no `select`
      },
    });

    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: mockUser.id },
      expect.any(String),
      { expiresIn: '1h' },
    );
  });

  it('validates user and returns token on login', async () => {
    const mockUser = {
      id: 1,
      name: 'Test',
      email: 'test@email.com',
      password: 'hashed',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.login({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(result).toEqual({
      token: 'token',
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      },
    });

    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: mockUser.id },
      expect.any(String),
      { expiresIn: '1h' },
    );
  });

  it('throws on invalid password', async () => {
    const mockUser = {
      id: 1,
      name: 'Test',
      email: 'test@email.com',
      password: 'hashed',
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: 'test@email.com', password: 'wrong' }),
    ).rejects.toThrow('Invalid credentials');
  });
});
