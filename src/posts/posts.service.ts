import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { ResponseType } from './types/response.type';
import { PostType } from './types/post.type';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}

  async getAllPostsUser(
    id: Types.ObjectId,
    favorite: string,
  ): Promise<ResponseType<PostType[]> | undefined> {
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
      'firstName lastName email profession',
    );

    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
      data: posts,
    };
  }

  async getOnePostUser(postId: string): Promise<ResponseType<PostType> | undefined> {
    const post = await this.PostModel.findById(postId);

    if (!post) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Post with current id not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
      data: post,
    };
  }
}
