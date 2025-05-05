import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { select } from '../users/services/users.service';

const getJwtSecret = () => process.env.JWT_SECRET!;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: { name: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
      select,
    });

    const token = jwt.sign({ sub: user.id }, getJwtSecret(), {
      expiresIn: '1h',
    });

    return { token, user };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign({ sub: user.id }, getJwtSecret(), {
      expiresIn: '1h',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return { token, user: safeUser };
  }
}
