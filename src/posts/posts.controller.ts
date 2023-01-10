import { Controller, Get, Post, Req, UseGuards, Query, Param, Body } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTokenDto } from 'src/token/dto/create-tokens.dto';
import { PostsService } from './posts.service';
import { ResponseType } from './types/response.type';
import { PostType } from './types/post.type';
import { CreatePostDto } from './dto/create-post.dto';

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

  @Post('create')
  async createPost(
    @Req() req: Request,
    @Body() createPostDto: CreatePostDto,
  ): Promise<ResponseType<PostType> | undefined> {
    const { id } = req.user as CreateTokenDto;
    const data = await this.postsService.createPost(id, createPostDto);
    return data;
  }
}
