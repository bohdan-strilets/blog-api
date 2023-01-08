import { Controller, UseGuards, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTokenDto } from 'src/token/dto/create-tokens.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-current')
  async getCurrent(@Req() req: Request) {
    const user = req.user as CreateTokenDto;
    const data = await this.usersService.getCurrent(user.id);
    return data;
  }
}
