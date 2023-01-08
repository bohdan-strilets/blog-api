import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { TokenModule } from 'src/token/token.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TokenModule,
    SendgridModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
