import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { Token, TokenSchema } from './schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({ secret: process.env.ACCESS_TOKEN_KEY, signOptions: { expiresIn: '1h' } }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
