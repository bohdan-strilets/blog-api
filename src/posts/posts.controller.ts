import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateTokenDto } from 'src/token/dto/create-tokens.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  async getAllPostsUser(@Req() req: Request, @Param('favorite') favorite: string) {
    const { id } = req.user as CreateTokenDto;
    const data = await this.postsService.getAllPostsUser(id, favorite);
    return data;
  }
}
