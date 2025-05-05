jest.mock('ioredis', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      quit: jest.fn(),
    })),
  };
});

import { RedisService } from './redis.service';
import Redis from 'ioredis';

describe('RedisService', () => {
  let service: RedisService;
  let redisInstance: jest.Mocked<any>;

  beforeEach(() => {
    service = new RedisService();
    redisInstance = (Redis as unknown as jest.Mock).mock.results[0].value;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call set with ttl', async () => {
    await service.set('key', 'value', 60);
    expect(redisInstance.set).toHaveBeenCalledWith('key', 'value', 'EX', 60);
  });

  it('should call set without ttl', async () => {
    await service.set('key', 'value');
    expect(redisInstance.set).toHaveBeenCalledWith('key', 'value');
  });

  it('should call get correctly', async () => {
    redisInstance.get.mockResolvedValue('abc');
    const result = await service.get('key');
    expect(redisInstance.get).toHaveBeenCalledWith('key');
    expect(result).toBe('abc');
  });

  it('should call del correctly', async () => {
    await service.del('key');
    expect(redisInstance.del).toHaveBeenCalledWith('key');
  });

  it('should call quit on onModuleDestroy', async () => {
    await service.onModuleDestroy();
    expect(redisInstance.quit).toHaveBeenCalled();
  });
});
