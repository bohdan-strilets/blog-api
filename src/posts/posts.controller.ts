import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTokenDto } from 'src/token/dto/create-tokens.dto';
import { PostsService } from './posts.service';
import { ResponseType } from './types/response.type';
import { PostType } from './types/post.type';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('get-all/:favorite')
  async getAllPostsUser(
    @Req() req: Request,
    @Param('favorite') favorite: string,
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
}
