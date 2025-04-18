import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/types/request';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    await this.offersService.create(req.user.id, createOfferDto);
    return {};
  }

  @Get()
  async getOffers() {
    return this.offersService.findAll();
  }

  @Get(':id')
  async getOfferById(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }
}
