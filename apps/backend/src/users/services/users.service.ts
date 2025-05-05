import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { User } from '@generated/prisma';
import * as bcrypt from 'bcrypt';

export const select = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  password: false,
};

export type SafeUser = Omit<User, 'password'> | null;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(data: CreateUserDto): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user: SafeUser = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
      select,
    });

    return user;
  }

  async findAll() {
    const cache = await this.redis.get('users');
    if (cache) return JSON.parse(cache) as User[];

    const users: SafeUser[] = await this.prisma.user.findMany({ select });
    await this.redis.set('users', JSON.stringify(users), 5);
    return users;
  }

  async findOne(id: number): Promise<SafeUser> {
    const cache = await this.redis.get(`user:${id}`);
    if (cache) return JSON.parse(cache) as User;

    const user: SafeUser = await this.prisma.user.findUnique({
      where: { id },
      select,
    });

    if (user) await this.redis.set(`user:${id}`, JSON.stringify(user), 120);
    return user;
  }

  async update(id: number, data: UpdateUserDto): Promise<SafeUser> {
    const user: SafeUser = await this.prisma.user.update({
      where: { id },
      data,
      select,
    });

    await this.redis.del(`user:${id}`);
    await this.redis.del('users');
    return user;
  }

  async remove(id: number): Promise<SafeUser> {
    const user: SafeUser = await this.prisma.user.delete({
      where: { id },
      select,
    });

    await this.redis.del(`user:${id}`);
    await this.redis.del('users');
    return user;
  }
}
