import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { Token, TokenSchema } from 'src/token/schemas/token.schema';
import { TokenModule } from 'src/token/token.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SendgridModule,
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    TokenModule,
    CloudinaryModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
