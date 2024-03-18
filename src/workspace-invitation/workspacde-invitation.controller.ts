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

@Controller('workspaces/:id/invitations')
export class WorkspacdeInvitationController {
  constructor(
    private readonly workspaceInvitationService: WorkspaceInvitationService,
  ) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
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
  async updateStatusInvitation(
    @Param('id') id: string,
    @Req() req: Request,
    @Body()
    updateWorkspaceInvitationData: UpdateWorkspaceInvitationDto,
  ) {
    return await this.workspaceInvitationService.updateStatus(
      id,
      updateWorkspaceInvitationData.invitingUserId,
      req.user.id,
      updateWorkspaceInvitationData.status,
    );
  }
}
