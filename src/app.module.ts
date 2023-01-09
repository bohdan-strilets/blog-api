import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { TokenModule } from './token/token.module';
import { AuthModule } from './auth/auth.module';
import { SendgridModule } from './sendgrid/sendgrid.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_HOST),
    UsersModule,
    TokenModule,
    AuthModule,
    SendgridModule,
    CloudinaryModule,
    PostsModule,
  ],
})
export class AppModule {}
