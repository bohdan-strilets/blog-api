import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ResponseType } from 'src/auth/types/response.type';
import { UserType } from 'src/auth/types/user.type';
import { ChangeProfileDto } from './dto/change-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

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
    console.log(changeProfileDto);

    if (Object.keys(changeProfileDto).length !== 0) {
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
}
