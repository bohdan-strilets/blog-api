import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ResponseType } from 'src/auth/types/response.type';
import { UserType } from 'src/auth/types/user.type';

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
      },
    };
  }
}
