import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from 'src/token/dto/create-tokens.dto';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly tokenService: TokenService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_KEY,
    });
  }

  async validate(payload: CreateTokenDto) {
    const tokenFromDb = await this.tokenService.findAccessTokenDb(payload.id);

    if (tokenFromDb) {
      return payload;
    }

    return null;
  }
}
