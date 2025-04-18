import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RequestWithUser } from 'src/types/request';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string, req: RequestWithUser) {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }

    req.user = user;

    return user;
  }
}
