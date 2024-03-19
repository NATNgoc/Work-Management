import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/authentication/guards/jwt-access-token.guard';
import { UpdateRoleMember } from './dto/update-role-member.dto';
import { Request } from 'express';
import { WorkspaceMemberService } from './workspace-member.service';
@Controller('workspaces/:id/members')
export class WorkspaceMemberController {
  constructor(
    private readonly workSpaceMemberService: WorkspaceMemberService,
  ) {}
  @Patch('roles')
  @UseGuards(JwtAccessTokenGuard)
  async grantRole(
    @Param('id') workSpaceId: string,
    @Req() req: Request,
    @Body() updateData: UpdateRoleMember,
  ) {
    return await this.workSpaceMemberService.updateRole(
      workSpaceId,
      updateData.userId,
      req.user.id,
      updateData.role,
    );
  }
}
