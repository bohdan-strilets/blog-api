import {
  Controller,
  UseGuards,
  Get,
  Patch,
  Post,
  Delete,
  Req,
  Res,
  Body,
  Param,
  Redirect,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserType } from 'src/auth/types/user.type';
import { TokensType } from 'src/auth/types/tokens.type';
import { ResponseType } from 'src/auth/types/response.type';
import { CreateTokenDto } from 'src/token/dto/create-tokens.dto';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  @HttpCode(HttpStatus.OK)
  @Post('repeat-verification-email')
  async repeatVerificationEmail(@Body() emailDto: EmailDto): Promise<ResponseType | undefined> {
    const data = await this.usersService.repeatVerificationEmail(emailDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-profile')
  async deleteProfile(@Req() req: Request): Promise<ResponseType | undefined> {
    const { id } = req.user as CreateTokenDto;
    const data = await this.usersService.deleteProfile(id);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post('request-password-reset')
  async requestPasswordReset(@Body() emailDto: EmailDto): Promise<ResponseType | undefined> {
    const data = await this.usersService.requestPasswordReset(emailDto);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponseType | undefined> {
    const data = await this.usersService.resetPassword(resetPasswordDto);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh-user')
  async refreshUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<TokensType> | undefined> {
    const refreshToken = req.cookies.refreshToken;
    const data = await this.usersService.refreshUser(refreshToken);
    res.cookie('refreshToken', data.tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('change-avatar')
  @UseInterceptors(FileInterceptor('user-avatar', { dest: 'src/public' }))
  async changeAvatar(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ResponseType<string> | undefined> {
    const { id } = req.user as CreateTokenDto;
    const data = await this.usersService.changeAvatar(file, id);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('change-background')
  @UseInterceptors(FileInterceptor('user-background', { dest: 'src/public' }))
  async changeBackground(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ResponseType<string> | undefined> {
    const { id } = req.user as CreateTokenDto;
    const data = await this.usersService.changeBackground(file, id);
    return data;
  }
}
