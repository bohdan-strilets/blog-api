import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), SendgridModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
