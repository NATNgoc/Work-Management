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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import FindAllMembersDto from './dto/find-all-member.dto';
@Controller('workspaces/:id/members')
@ApiTags('Workspace member')
@ApiBearerAuth()
export class WorkspaceMemberController {
  constructor(
    private readonly workSpaceMemberService: WorkspaceMemberService,
  ) {}

  @Patch('roles')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Grant a role to a workspace member' })
  @ApiResponse({ status: 200, description: 'Role granted successfully.' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiBody({ type: UpdateRoleMember })
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
  @ApiOperation({ summary: 'Find all members of a workspace' })
  @ApiResponse({
    status: 200,
    description: 'Members found successfully.',
    type: [WorkspaceMember],
  })

  @ApiParam({ name: 'id', description: 'Workspace ID' })
  async findAll(
    @Req() req: Request,
    @Param('id') id: string,
    @Query() queryData: FindAllMembersDto,
  ): Promise<WorkspaceMember[]> {
    return await this.workSpaceMemberService.findAllWithWorkspaceIdAndUserId(
      req.user.id,
      id,
      queryData,
    );
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Delete a member from a workspace' })
  @ApiResponse({
    status: 200,
    description: 'Member deleted successfully.',
    type: WorkspaceMember,
  })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiBody({ type: DeleteMember })
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
