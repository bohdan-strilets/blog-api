import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/token/token.service';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { RegistrationDto } from './dto/registration.dto';
import { ResponseType } from './types/response.type';
import { TokensType } from './types/tokens.type';
import { UserType } from './types/user.type';
import { LoginDto } from './dto/login.dto';
import { SendgridService } from 'src/sendgrid/sendgrid.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly tokenService: TokenService,
    private readonly sendgridService: SendgridService,
  ) {}

  async registration(
    registrationDto: RegistrationDto,
  ): Promise<ResponseType<TokensType, UserType> | ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: registrationDto.email });

    if (user) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'Email in use.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const activationToken = v4();
    const avatarURL =
      'https://res.cloudinary.com/ddd1vgg5b/image/upload/v1673171280/blog/users/avatars/lui3rrpwupwsisnedj7j.jpg';
    const backgroundURL =
      'https://res.cloudinary.com/ddd1vgg5b/image/upload/v1673171271/blog/users/backgrounds/w5n3l3moegsgqk3dahv0.jpg';
    const hashPassword = bcrypt.hashSync(registrationDto.password, bcrypt.genSaltSync(10));

    const newUser = await this.UserModel.create({
      ...registrationDto,
      password: hashPassword,
      activationToken,
      avatarURL,
      backgroundURL,
    });

    const payload = this.tokenService.createPayload(newUser);
    const tokens = await this.tokenService.createTokens(payload);

    const mail = this.sendgridService.confirmEmail(newUser.email, newUser.activationToken);
    await this.sendgridService.sendEmail(mail);

    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
      tokens,
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

  async login(
    loginDto: LoginDto,
  ): Promise<ResponseType<TokensType, UserType> | ResponseType | undefined> {
    const user = await this.UserModel.findOne({ email: loginDto.email });

    if (!user || !bcrypt.compareSync(loginDto.password, user.password) || !user.isActivated) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Email or password is wrong or account not verify.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = this.tokenService.createPayload(user);
    const tokens = await this.tokenService.createTokens(payload);

    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
      tokens,
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

  async logout(refreshToken: string): Promise<ResponseType | undefined> {
    if (!refreshToken) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User is not authorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userData = this.tokenService.checkRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findRefreshTokenDb(userData.id);

    if (!userData || !tokenFromDb) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'User is not authorized.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.tokenService.deleteTokensFromDb(refreshToken);

    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
    };
  }
}
