import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { User, UserDocument } from './schemas/user.schema';
import { ResponseType } from 'src/auth/types/response.type';
import { UserType } from 'src/auth/types/user.type';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailDto } from './dto/email.dto';
import { SendgridService } from 'src/sendgrid/sendgrid.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly sendgridService: SendgridService,
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
        phoneNumber: user.phoneNumber,
        profession: user.profession,
        avatarURL: user.avatarURL,
        backgroundURL: user.backgroundURL,
        hobby: user.hobby,
        posts: user.posts,
        projects: user.projects,
        stories: user.stories,
        statistics: user.statistics,
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
        phoneNumber: newUser.phoneNumber,
        profession: newUser.profession,
        avatarURL: newUser.avatarURL,
        backgroundURL: newUser.backgroundURL,
        hobby: newUser.hobby,
        posts: newUser.posts,
        projects: newUser.projects,
        stories: newUser.stories,
        statistics: newUser.statistics,
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
}
