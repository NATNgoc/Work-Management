import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const EnsureUserOwnership = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const id = request.params.id;
    const userId = request.user.id;

    if (id !== userId) {
      throw new UnauthorizedException(
        'You can only perform CRUD operations for yourself',
      );
    }
  },
);
