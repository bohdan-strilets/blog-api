import {
  Controller,
  UseGuards,
  Get,
  Patch,
  Req,
  Body,
  Param,
  Redirect,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserType } from 'src/auth/types/user.type';
import { ResponseType } from 'src/auth/types/response.type';
import { CreateTokenDto } from 'src/token/dto/create-tokens.dto';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';

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

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<ResponseType | undefined> {
    const { id } = req.user as CreateTokenDto;
    const data = await this.usersService.changePassword(id, changePasswordDto);
    return data;
  }

  @Get('verification-email/:activationToken')
  @Redirect(process.env.CLIENT_URL, HttpStatus.PERMANENT_REDIRECT)
  async verificationEmail(
    @Param('activationToken') activationToken: string,
  ): Promise<ResponseType | undefined> {
    const data = await this.usersService.verificationEmail(activationToken);
    return data;
  }
}
