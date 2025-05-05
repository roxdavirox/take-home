import { PrismaService } from './prisma.service';

const mockConnect = jest.fn();
const mockDisconnect = jest.fn();

jest.mock('@generated/prisma', () => {
  function MockPrismaClient(this: any) {
    this.$connect = mockConnect;
    this.$disconnect = mockDisconnect;
  }

  return {
    PrismaClient: MockPrismaClient,
  };
});

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(() => {
    service = new PrismaService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call $connect on onModuleInit', async () => {
    await service.onModuleInit();
    expect(mockConnect).toHaveBeenCalled();
  });

  it('should call $disconnect on onModuleDestroy', async () => {
    await service.onModuleDestroy();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
