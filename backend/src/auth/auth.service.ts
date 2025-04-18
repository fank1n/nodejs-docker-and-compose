import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { RequestWithUser } from 'src/types/request';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  async validateUser(username: string, password: string) {
    const userPassword = password;
    const user = await this.usersService.findOne(username);

    if (user) {
      const isValidHash = await this.hashService.compare(
        userPassword,
        user.password,
      );

      return isValidHash ? user : null;
    }
    return null;
  }

  async signin(req: RequestWithUser) {
    const payload = { sub: req.user.id, username: req.user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signup(user: CreateUserDto) {
    const { email, username } = user;

    const isUserExits = await this.usersService.findByEmailOrUsername(
      email,
      username,
    );

    if (isUserExits.length) {
      throw new ConflictException(
        'Пользователь с таким email или username уже существует',
      );
    }

    return this.usersService.create(user);
  }
}
