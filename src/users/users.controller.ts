import { Controller, UseGuards, Get, Patch, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserType } from 'src/auth/types/user.type';
import { ResponseType } from 'src/auth/types/response.type';
import { CreateTokenDto } from 'src/token/dto/create-tokens.dto';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('get-current')
  async getCurrent(@Req() req: Request): Promise<ResponseType<UserType> | undefined> {
    const { id } = req.user as CreateTokenDto;
    const data = await this.usersService.getCurrent(id);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-profile')
  async changeProfile(
    @Body() changeProfileDto: ChangeProfileDto,
    @Req() req: Request,
  ): Promise<ResponseType<UserType> | undefined> {
    const { id } = req.user as CreateTokenDto;
    const data = await this.usersService.changeProfile(id, changeProfileDto);
    return data;
  }
}
