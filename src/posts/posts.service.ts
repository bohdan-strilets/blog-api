import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { ResponseType } from './types/response.type';
import { PostType } from './types/post.type';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

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

  async updatePost(
    updatePostDto: UpdatePostDto,
    postId: string,
  ): Promise<ResponseType<PostType> | undefined> {
    const newPost = await this.PostModel.findByIdAndUpdate(postId, updatePostDto, { new: true });

    if (!newPost) {
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
      data: newPost,
    };
  }

  async deletePost(postId: string): Promise<ResponseType<PostType> | undefined> {
    const post = await this.PostModel.findByIdAndDelete(postId);

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
      message: 'Post successful deleted.',
      data: post,
    };
  }

  async updateFavorite(postId: string): Promise<ResponseType<PostType> | undefined> {
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

    if (post.isFavorite) {
      const newPost = await this.PostModel.findByIdAndUpdate(
        postId,
        { isFavorite: false },
        { new: true },
      );

      return {
        status: 'success',
        code: 200,
        success: true,
        message: '',
        data: newPost,
      };
    }

    if (!post.isFavorite) {
      const newPost = await this.PostModel.findByIdAndUpdate(
        postId,
        { isFavorite: true },
        { new: true },
      );

      return {
        status: 'success',
        code: 200,
        success: true,
        message: '',
        data: newPost,
      };
    }
  }

  async updatePublic(postId: string): Promise<ResponseType<PostType> | undefined> {
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

    if (post.isPublic) {
      const newPost = await this.PostModel.findByIdAndUpdate(
        postId,
        { isPublic: false },
        { new: true },
      );

      return {
        status: 'success',
        code: 200,
        success: true,
        message: '',
        data: newPost,
      };
    }

    if (!post.isPublic) {
      const newPost = await this.PostModel.findByIdAndUpdate(
        postId,
        { isPublic: true },
        { new: true },
      );

      return {
        status: 'success',
        code: 200,
        success: true,
        message: '',
        data: newPost,
      };
    }
  }

  async addLike(postId: string, id: Types.ObjectId): Promise<ResponseType<PostType> | undefined> {
    const post = await this.PostModel.findById(postId);
    const user = await this.UserModel.findById(id);

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

    if (!post.whoLikes.find(item => item.id.toString() === id.toString())) {
      const userWhoLiked = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const newPost = await this.PostModel.findByIdAndUpdate(
        postId,
        {
          whoLikes: [...post.whoLikes, userWhoLiked],
          $inc: {
            'statistics.numberLikes': 1,
          },
        },
        { new: true },
      );

      return {
        status: 'success',
        code: 200,
        success: true,
        message: '',
        data: newPost,
      };
    }

    if (post.whoLikes.find(item => item.id.toString() === id.toString())) {
      const result = post.whoLikes.filter(item => item.id.toString() !== id.toString());

      const newPost = await this.PostModel.findByIdAndUpdate(
        postId,
        {
          whoLikes: result,
          $inc: {
            'statistics.numberLikes': -1,
          },
        },
        { new: true },
      );

      return {
        status: 'success',
        code: 200,
        success: true,
        message: '',
        data: newPost,
      };
    }
  }
}
