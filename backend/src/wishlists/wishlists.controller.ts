import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { RequestWithUser } from 'src/types/request';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}
  @Get()
  getWishlists() {
    return this.wishlistsService.findAll();
  }

  @Post()
  create(
    @Req() req: RequestWithUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistsService.create(+req.user.id, createWishlistDto);
  }

  @Get(':id')
  getWishlistById(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  updateWishlist(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateOne(req.user.id, +id, updateWishlistDto);
  }

  @Delete(':id')
  removeWishlist(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.wishlistsService.removeOne(req.user.id, +id);
  }
}
