import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import * as fs from 'fs/promises';
import { User, UserDocument } from './schemas/user.schema';
import { ResponseType } from 'src/auth/types/response.type';
import { UserType } from 'src/auth/types/user.type';
import { TokensType } from 'src/auth/types/tokens.type';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailDto } from './dto/email.dto';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { Token, TokenDocument } from 'src/token/schemas/token.schema';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokenService } from 'src/token/token.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly sendgridService: SendgridService,
    @InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
    private readonly tokenService: TokenService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getCurrent(id: Types.ObjectId): Promise<ResponseType<UserType> | undefined> {
    const user = await this.UserModel.findById(id);
    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateBirth: user.dateBirth,
        gender: user.gender,
        adress: user.adress,
        socialMedia: user.socialMedia,
        phoneNumber: user.phoneNumber,
        profession: user.profession,
        description: user.description,
        avatarURL: user.avatarURL,
        backgroundURL: user.backgroundURL,
        hobby: user.hobby,
        isActivated: user.isActivated,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async changeProfile(
    id: Types.ObjectId,
    changeProfileDto: ChangeProfileDto,
  ): Promise<ResponseType<UserType> | undefined> {
    if (Object.keys(changeProfileDto).length === 0) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Check the correctness of the entered data.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = await this.UserModel.findByIdAndUpdate(id, changeProfileDto, { new: true });
    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        dateBirth: newUser.dateBirth,
        gender: newUser.gender,
        adress: newUser.adress,
        socialMedia: newUser.socialMedia,
        phoneNumber: newUser.phoneNumber,
        profession: newUser.profession,
        description: newUser.description,
        avatarURL: newUser.avatarURL,
        backgroundURL: newUser.backgroundURL,
        hobby: newUser.hobby,
        isActivated: newUser.isActivated,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    };
  }

  async changePassword(
    id: Types.ObjectId,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findById(id);

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!bcrypt.compareSync(changePasswordDto.password, user.password)) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Password is wrong.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hashPassword = bcrypt.hashSync(changePasswordDto.newPassword, bcrypt.genSaltSync(10));
    await this.UserModel.findByIdAndUpdate(id, { password: hashPassword });

    return {
      status: 'success',
      code: 200,
      success: true,
      message: 'Password has been successfully changed.',
    };
  }

  async verificationEmail(activationToken: string): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ activationToken });

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.UserModel.findByIdAndUpdate(user._id, { isActivated: true, activationToken: null });

    return {
      status: 'success',
      code: 308,
      success: true,
      message: 'You have successfully verified your email address.',
    };
  }

  async repeatVerificationEmail(emailDto: EmailDto): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: emailDto.email });

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const activationToken = v4();
    const mail = this.sendgridService.confirmEmail(emailDto.email, activationToken);
    await this.sendgridService.sendEmail(mail);
    await this.UserModel.findByIdAndUpdate(user._id, { activationToken });

    return {
      status: 'success',
      code: 200,
      success: true,
      message: 'The confirmation email has been sent again.',
    };
  }

  async deleteProfile(id: Types.ObjectId): Promise<ResponseType | undefined> {
    const tokens = await this.TokenModel.findOne({ owner: id });

    await this.UserModel.findByIdAndRemove(id);
    await this.TokenModel.findByIdAndRemove(tokens._id);

    return {
      status: 'success',
      code: 200,
      success: true,
      message: 'Your account and all your data has been successfully deleted.',
    };
  }

  async requestPasswordReset(emailDto: EmailDto): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: emailDto.email });

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Email is wrong. Such a user does not exist.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const name = `${user.firstName} ${user.lastName}`;
    const mail = this.sendgridService.resetPassword(emailDto.email, name);
    await this.sendgridService.sendEmail(mail);

    return {
      status: 'success',
      code: 200,
      success: true,
      message: 'An email with a link to reset your password has been sent to your email address.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: resetPasswordDto.email });

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Invalid email. There is no user with this email address.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const hashPassword = bcrypt.hashSync(resetPasswordDto.password, bcrypt.genSaltSync(10));
    await this.UserModel.findByIdAndUpdate(user._id, { password: hashPassword });

    return {
      status: 'success',
      code: 200,
      success: true,
      message: 'The password has been successfully changed.',
    };
  }

  async refreshUser(refreshToken: string): Promise<ResponseType<TokensType> | undefined> {
    if (!refreshToken) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User not authorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userData = this.tokenService.checkRefreshToken(refreshToken);
    const user = await this.UserModel.findById(userData.id);
    const tokenFromDb = await this.tokenService.findRefreshTokenDb(userData.id);
    const payload = this.tokenService.createPayload(user);

    if (!userData || !tokenFromDb) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User not authorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokens = await this.tokenService.createTokens(payload);

    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
      tokens,
    };
  }

  async changeAvatar(
    file: Express.Multer.File,
    id: Types.ObjectId,
  ): Promise<ResponseType<string> | undefined> {
    const folder = 'blog/users/avatars';
    const cloudinaryRes = await this.cloudinaryService.uploadImage(file, folder);

    if (cloudinaryRes) {
      fs.unlink(file.path);
    }

    await this.UserModel.findByIdAndUpdate(id, { avatarURL: cloudinaryRes.url });

    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
      imageURL: cloudinaryRes.url,
    };
  }

  async changeBackground(
    file: Express.Multer.File,
    id: Types.ObjectId,
  ): Promise<ResponseType<string> | undefined> {
    const folder = 'blog/users/backgrounds';
    const cloudinaryRes = await this.cloudinaryService.uploadImage(file, folder);

    if (cloudinaryRes) {
      fs.unlink(file.path);
    }

    await this.UserModel.findByIdAndUpdate(id, { backgroundURL: cloudinaryRes.url });

    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
      imageURL: cloudinaryRes.url,
    };
  }
}
