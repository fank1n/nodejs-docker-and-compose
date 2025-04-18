import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/types/request';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  createWish(
    @Req() req: RequestWithUser,
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.create(req.user.id, createWishDto);
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.getLast();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.getTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateOne(
    @Req() req: RequestWithUser,
    @Param('id') wishId: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateOne(req.user.id, +wishId, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  removeOne(@Req() req: RequestWithUser, @Param('id') wishId: string) {
    return this.wishesService.removeOne(req.user.id, +wishId);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyOne(@Req() req: RequestWithUser, @Param('id') wishId: string) {
    return this.wishesService.copyOne(req.user.id, +wishId);
  }
}
