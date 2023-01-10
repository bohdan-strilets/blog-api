import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}

  async getAllPostsUser(id: Types.ObjectId, favorite: string) {
    if (favorite) {
      const favoritePosts = await this.PostModel.find({ owner: id, isFavorite: true });

      return {
        status: 'success',
        code: 200,
        success: true,
        message: '',
        data: favoritePosts,
      };
    }

    const posts = await this.PostModel.find({ owner: id }).populate(
      'owner',
      '_id firstName lastName email',
    );

    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
      data: posts,
    };
  }
}
