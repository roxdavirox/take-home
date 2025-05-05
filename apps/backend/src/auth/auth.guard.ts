import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    console.log('TOKEN RECEBIDO NO GUARD:', request.cookies);
    const token = request.cookies?.token;

    if (!token) throw new UnauthorizedException('Token não encontrado');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      // Se quiser acessar o usuário no controller, você pode fazer:
      (request as any).user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
