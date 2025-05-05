import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const now = new Date();
  const mockUser = {
    id: 1,
    name: 'Test',
    email: 'test@email.com',
    password: 'fake-hashed-password',
    createdAt: now,
    updatedAt: now,
  };

  const mockResponse = {
    token: 'token',
    user: mockUser,
  };

  const res = {
    cookie: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should call authService.register with correct data', async () => {
    const mockBody = {
      name: 'Test',
      email: 'test@email.com',
      password: '123456',
    };

    jest.spyOn(authService, 'register').mockResolvedValue(mockResponse);

    const result = await controller.register(mockBody, res);

    expect(result).toEqual(mockUser);
    expect(authService.register).toHaveBeenCalledWith(mockBody);
    expect(res.cookie).toHaveBeenCalledWith(
      'token',
      mockResponse.token,
      expect.objectContaining({ httpOnly: true }),
    );
  });

  it('should call authService.login with correct data', async () => {
    const mockBody = {
      email: 'test@email.com',
      password: '123456',
    };

    jest.spyOn(authService, 'login').mockResolvedValue(mockResponse);

    const result = await controller.login(mockBody, res);

    expect(result).toEqual(mockUser);
    expect(authService.login).toHaveBeenCalledWith(mockBody);
    expect(res.cookie).toHaveBeenCalledWith(
      'token',
      mockResponse.token,
      expect.objectContaining({ httpOnly: true }),
    );
  });
});
