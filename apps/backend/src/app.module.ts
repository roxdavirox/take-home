import { Module } from '@nestjs/common';
import { UsersController } from './users/controllers/users.controller';
import { UsersService } from './users/services/users.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [UsersController, AuthController],
  providers: [UsersService, RedisService, AuthService],
})
export class AppModule {}
