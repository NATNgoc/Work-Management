import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/authentication/guards/jwt-access-token.guard';
import { UpdateRoleMember } from './dto/update-role-member.dto';
import { Request } from 'express';
import { WorkspaceMemberService } from './workspace-member.service';
import DeleteMember from './dto/delete-member.dto';
import { WorkspaceMember } from './entities/workspace-member.entity';
import RoleGuard from 'src/authentication/guards/role.guard';
import UserRole from 'src/enum/user-role.enum';
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

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  async findAll(): Promise<WorkspaceMember[]> {
    return null;
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
  async deleteMember(
    @Param('id') workSpaceId: string,
    @Req() req: Request,
    @Body() deleteData: DeleteMember,
  ): Promise<WorkspaceMember> {
    return await this.workSpaceMemberService.delete(
      workSpaceId,
      deleteData.userId,
      req.user.id,
    );
  }
}
