import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('Smoke test - App bootstrap', () => {
  let app: INestApplication;

  it('should start the application without errors', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.enableCors(); // simula o main.ts
    await app.init();

    expect(app).toBeDefined();
    await app.close();
  });
});
