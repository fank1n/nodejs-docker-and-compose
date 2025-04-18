import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RequestWithUser } from 'src/types/request';
import { LocalGuard } from './guards/local.guard';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req: RequestWithUser) {
    return this.authService.signin(req);
  }

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }
}
