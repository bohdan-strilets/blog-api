import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Token, TokenDocument } from './schemas/token.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { CreateTokenDto } from './dto/create-tokens.dto';
import { TokensType } from 'src/auth/types/tokens.type';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
  ) {}

  createPayload(user: UserDocument): CreateTokenDto {
    return {
      id: user._id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      isActivated: user.isActivated,
    };
  }

  async createTokens(payload: CreateTokenDto): Promise<TokensType> {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: '15d',
    });

    const tokens = { accessToken, refreshToken };
    const tokensFromDb = await this.TokenModel.findOne({ owner: payload.id });

    if (!tokensFromDb) {
      await this.TokenModel.create({ ...tokens, owner: payload.id });
    }

    if (tokensFromDb) {
      await this.TokenModel.findByIdAndUpdate(tokensFromDb._id, tokens);
    }

    return tokens;
  }

  checkRefreshToken(refreshToken: string): CreateTokenDto | null {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    if (payload) {
      return payload;
    } else {
      return null;
    }
  }

  async findRefreshTokenDb(userId: Types.ObjectId) {
    const token = await this.TokenModel.findOne({ owner: userId });

    if (token) {
      return token;
    } else {
      return null;
    }
  }

  async deleteTokensFromDb(refreshToken: string): Promise<void> {
    const { _id } = await this.TokenModel.findOne({ refreshToken });
    await this.TokenModel.findByIdAndRemove(_id);
  }
}
