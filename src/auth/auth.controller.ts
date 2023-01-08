import {
  Controller,
  HttpCode,
  HttpStatus,
  Body,
  Res,
  Req,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ResponseType } from './types/response.type';
import { TokensType } from './types/tokens.type';
import { UserType } from './types/user.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('registration')
  async registration(
    @Body() registrationDto: RegistrationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<TokensType, UserType> | ResponseType | undefined> {
    const data = await this.authService.registration(registrationDto);
    res.cookie('refreshToken', data.tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<TokensType, UserType> | ResponseType | undefined> {
    const data = await this.authService.login(loginDto);
    res.cookie('refreshToken', data.tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType | undefined> {
    const refreshToken = req.cookies.refreshToken;
    const data = await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return data;
  }
}
