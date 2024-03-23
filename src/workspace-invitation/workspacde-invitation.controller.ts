import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/authentication/guards/jwt-access-token.guard';
import { CreateAndDeleteWorkspaceInvitationDto } from './dto/create-workspace-invitation.dto';
import { Request } from 'express';
import { WorkspaceInvitationService } from './workspace-invitation.service';
import { UpdateWorkspaceInvitationDto } from './dto/update-workspace-invitation.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('workspaces/:id/invitations')
@ApiTags('Workspacde Invitation')
@ApiBearerAuth()
export class WorkspacdeInvitationController {
  constructor(
    private readonly workspaceInvitationService: WorkspaceInvitationService,
  ) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Invite a user to a workspace' })
  @ApiResponse({ status: 201, description: 'User invited successfully.' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiBody({ type: CreateAndDeleteWorkspaceInvitationDto })
  async inviteUserToSpace(
    @Param('id') id: string,
    @Req() req: Request,
    @Body()
    createWorkspaceInvitationData: CreateAndDeleteWorkspaceInvitationDto,
  ) {
    return await this.workspaceInvitationService.create(
      id,
      req.user.id,
      createWorkspaceInvitationData.invitedUserId,
    );
  }

  @Delete('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Remove an invitation to a workspace' })
  @ApiResponse({ status: 200, description: 'Invitation removed successfully.' })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiBody({ type: CreateAndDeleteWorkspaceInvitationDto })
  async removeInvitation(
    @Param('id') id: string,
    @Req() req: Request,
    @Body()
    createWorkspaceInvitationData: CreateAndDeleteWorkspaceInvitationDto,
  ) {
    return await this.workspaceInvitationService.delete(
      id,
      req.user.id,
      createWorkspaceInvitationData.invitedUserId,
    );
  }

  @Patch('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Update the status of a workspace invitation' })
  @ApiResponse({
    status: 200,
    description: 'Invitation status updated successfully.',
  })
  @ApiParam({ name: 'id', description: 'Workspace ID' })
  @ApiBody({ type: UpdateWorkspaceInvitationDto })
  async updateStatusInvitation(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateWorkspaceInvitationData: UpdateWorkspaceInvitationDto,
  ) {
    return await this.workspaceInvitationService.updateStatus(
      id,
      updateWorkspaceInvitationData.invitingUserId,
      req.user.id,
      updateWorkspaceInvitationData.status,
    );
  }
}
