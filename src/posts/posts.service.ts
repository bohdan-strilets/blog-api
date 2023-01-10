import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { ResponseType } from './types/response.type';
import { PostType } from './types/post.type';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}

  async getAllPostsUser(
    id: Types.ObjectId,
    favorite: boolean,
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

  async createPost(
    id: Types.ObjectId,
    createPostDto: CreatePostDto,
  ): Promise<ResponseType<PostType> | undefined> {
    const backgroundURL =
      'https://res.cloudinary.com/ddd1vgg5b/image/upload/v1673364791/blog/posts/backgrounds/nzy91revphdejb9bgnv8.jpg';
    const newPost = await this.PostModel.create({ ...createPostDto, backgroundURL, owner: id });

    return {
      status: 'success',
      code: 201,
      success: true,
      message: '',
      data: newPost,
    };
  }
}
