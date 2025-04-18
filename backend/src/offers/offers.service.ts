import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto) {
    const { amount, itemId } = createOfferDto;

    const owner = await this.usersRepository.findOneBy({ id: userId });
    const wish = await this.wishesRepository.findOne({
      where: { id: itemId },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }

    if (userId === wish.owner.id) {
      throw new ForbiddenException(
        'Вы не можете вносить деньги на собственные подарки',
      );
    }

    const raised = Number(wish.raised) + Number(amount);
    if (raised > wish.price) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }

    await this.wishesRepository.increment({ id: wish.id }, 'raised', amount);
    await this.wishesRepository.update(itemId, { raised: raised });

    await this.offersRepository.save({
      ...createOfferDto,
      owner: owner,
      item: wish,
    });

    return {};
  }

  async findAll() {
    return this.offersRepository.find({
      relations: { user: true, item: true },
    });
  }

  async findOne(offerId: number) {
    return this.offersRepository.find({
      where: { id: offerId },
      relations: { user: true, item: true },
    });
  }
}
