import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAccessTokenGuard } from 'src/authentication/guards/jwt-access-token.guard';

@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get()
  findAll() {
    return 'all'
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
   
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    
  }
}
