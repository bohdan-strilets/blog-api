import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  Query,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTokenDto } from 'src/token/dto/create-tokens.dto';
import { PostsService } from './posts.service';
import { ResponseType } from './types/response.type';
import { PostType } from './types/post.type';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post-dto';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('get-all')
  async getAllPostsUser(
    @Req() req: Request,
    @Query('favorite') favorite: boolean,
  ): Promise<ResponseType<PostType[]> | undefined> {
    const { id } = req.user as CreateTokenDto;
    const data = await this.postsService.getAllPostsUser(id, favorite);
    return data;
  }

  @Get('get-one/:postId')
  async getOnePostUser(
    @Param('postId') postId: string,
  ): Promise<ResponseType<PostType> | undefined> {
    const data = await this.postsService.getOnePostUser(postId);
    return data;
  }

  @Post('create-post')
  async createPost(
    @Req() req: Request,
    @Body() createPostDto: CreatePostDto,
  ): Promise<ResponseType<PostType> | undefined> {
    const { id } = req.user as CreateTokenDto;
    const data = await this.postsService.createPost(id, createPostDto);
    return data;
  }

  @Put('update-post/:postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ResponseType<PostType> | undefined> {
    const data = await this.postsService.updatePost(updatePostDto, postId);
    return data;
  }

  @Delete('delete-post/:postId')
  async deletePost(@Param('postId') postId: string): Promise<ResponseType<PostType> | undefined> {
    const data = await this.postsService.deletePost(postId);
    return data;
  }

  @Get('update-favorite/:postId')
  async updateFavorite(
    @Param('postId') postId: string,
  ): Promise<ResponseType<PostType> | undefined> {
    const data = await this.postsService.updateFavorite(postId);
    return data;
  }

  @Get('update-public/:postId')
  async updatePublic(@Param('postId') postId: string): Promise<ResponseType<PostType> | undefined> {
    const data = await this.postsService.updatePublic(postId);
    return data;
  }

  @Get('add-like/:postId')
  async addLike(
    @Req() req: Request,
    @Param('postId') postId: string,
  ): Promise<ResponseType<PostType> | undefined> {
    const { id } = req.user as CreateTokenDto;
    const data = await this.postsService.addLike(postId, id);
    return data;
  }

  @Get('add-view/:postId')
  async addView(@Param('postId') postId: string): Promise<ResponseType<PostType> | undefined> {
    const data = await this.postsService.addView(postId);
    return data;
  }
}
