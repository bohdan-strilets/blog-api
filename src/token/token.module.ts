import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { Token, TokenSchema } from './schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({}),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
