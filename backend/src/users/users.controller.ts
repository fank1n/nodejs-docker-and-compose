import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestWithUser } from 'src/types/request';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUser(@Req() req: RequestWithUser) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  updateUser(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getUserWishes(@Req() req: RequestWithUser) {
    return this.usersService.getUserWishesById(req.user.id);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Post('find')
  findMany(@Body() reqBody: FindUserDto) {
    return this.usersService.findMany(reqBody.query);
  }

  @Get(':username/wishes')
  getUserWishesByName(@Param('username') username: string) {
    return this.usersService.getUserWishesByName(username);
  }
}
