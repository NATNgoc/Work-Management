import { Type, CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import UserRole from 'src/enum/user-role.enum';
import { Request } from 'express';

const RoleGuard = (role: UserRole): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request: Request = context.switchToHttp().getRequest();
      const user = request.user;

      return user?.role === role;
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
