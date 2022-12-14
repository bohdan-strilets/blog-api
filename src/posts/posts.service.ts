import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs/promises';
import { v4 } from 'uuid';
import { Post, PostDocument } from './schemas/post.schema';
import { ResponseType } from './types/response.type';
import { PostType } from './types/post.type';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ChangeCommentDto } from './dto/change-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly cloudinaryService: CloudinaryService,
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

  async addView(postId: string): Promise<ResponseType<PostType> | undefined> {
    const post = await this.PostModel.findByIdAndUpdate(
      postId,
      {
        $inc: {
          'statistics.numberViews': 1,
        },
      },
      { new: true },
    );

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

  async changeBackground(
    file: Express.Multer.File,
    postId: string,
  ): Promise<ResponseType<PostType> | undefined> {
    const folder = 'blog/posts/backgrounds';
    const cloudinaryRes = await this.cloudinaryService.uploadImage(file, folder);

    if (cloudinaryRes) {
      fs.unlink(file.path);
    }

    const post = await this.PostModel.findByIdAndUpdate(
      postId,
      {
        backgroundURL: cloudinaryRes.url,
      },
      { new: true },
    );

    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
      data: post,
    };
  }

  async changeImages(
    files: Array<Express.Multer.File>,
    postId: string,
  ): Promise<ResponseType<PostType> | undefined> {
    const folder = 'blog/posts/images';
    const imagesURL = [];

    const cloudinaryRes = await Promise.all(
      files.map(async item => await this.cloudinaryService.uploadImage(item, folder)),
    );

    cloudinaryRes.map(item => imagesURL.push(item.url));

    if (cloudinaryRes) {
      files.map(item => fs.unlink(item.path));
    }

    const post = await this.PostModel.findByIdAndUpdate(postId, { imagesURL }, { new: true });

    return {
      status: 'success',
      code: 200,
      success: true,
      message: '',
      data: post,
    };
  }

  async createComment(
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<ResponseType<PostType> | undefined> {
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

    const comment = {
      id: v4(),
      owner: post.owner,
      text: createCommentDto.text,
      numberLikes: 0,
      answers: [],
    };

    const newPost = await this.PostModel.findByIdAndUpdate(
      postId,
      {
        statistics: {
          comments: [...post.statistics.comments, comment],
          $inc: {
            'statistics.numberComments': 1,
          },
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

  async changeComment(
    postId: string,
    commentId: string,
    changeCommentDto: ChangeCommentDto,
  ): Promise<ResponseType<PostType> | undefined> {
    const post = await this.PostModel.findById(postId);
    const comment = post.statistics.comments.find(item => item.id === commentId);

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

    const updateComment = {
      id: comment.id,
      owner: comment.owner,
      text: changeCommentDto.text,
      numberLikes: comment.numberLikes,
      answers: comment.answers,
    };

    const oldComments = post.statistics.comments.filter(item => item.id !== commentId);
    const result = [...oldComments, updateComment];

    const newPost = await this.PostModel.findByIdAndUpdate(
      postId,
      {
        statistics: { comments: result },
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

  async deleteComment(
    postId: string,
    commentId: string,
  ): Promise<ResponseType<PostType> | undefined> {
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

    const result = post.statistics.comments.filter(item => item.id !== commentId);

    const newPost = await this.PostModel.findByIdAndUpdate(
      postId,
      {
        statistics: { comments: result },
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
