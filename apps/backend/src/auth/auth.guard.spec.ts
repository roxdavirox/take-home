// apps/backend/src/auth/auth.guard.spec.ts
import { AuthGuard } from './auth.guard';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';

jest.mock('jsonwebtoken');

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    guard = new AuthGuard();
    jest.clearAllMocks();
  });

  it('should return true and attach user to request if token is valid', () => {
    const mockDecoded = { sub: 1, name: 'User' };
    (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

    const req = {
      cookies: { token: 'validtoken' },
    } as any;

    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;

    const result = guard.canActivate(context);
    expect(result).toBe(true);
    expect(req.user).toEqual(mockDecoded);
  });

  it('should throw UnauthorizedException if token is missing', () => {
    const req = {
      headers: {},
    } as any;

    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const req = {
      headers: { authorization: 'Bearer invalidtoken' },
    } as any;

    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
