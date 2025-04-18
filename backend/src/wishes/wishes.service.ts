import { type Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async create(userId: number, createWishDto: CreateWishDto) {
    const { name, link, image, price, description } = createWishDto;
    const user = await this.usersService.findById(userId);
    const wish = this.wishesRepository.create({
      name,
      link,
      image,
      price,
      description,
      raised: 0,
      owner: user,
      offers: [],
    });

    await this.wishesRepository.save(wish);

    return { name, link, image, price, description };
  }

  async getLast() {
    const lastWishes = await this.wishesRepository.find({
      relations: { owner: true, offers: true },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });

    return lastWishes;
  }

  async getTop() {
    const topWishes = await this.wishesRepository.find({
      relations: { owner: true, offers: true },
      order: {
        copied: 'DESC',
      },
      take: 40,
    });

    return topWishes;
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });

    return wish;
  }

  async updateOne(
    userId: number,
    wishId: number,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(
        'Редактировать можно только свои свои подарки',
      );
    }

    if (wish.raised > 0) {
      throw new BadRequestException(
        'Вы не можете редактировать этот подарок, так как уже идет сбор средств',
      );
    }

    await this.wishesRepository.update(wishId, updateWishDto);

    return {};
  }

  async removeOne(userId: number, wishId: number) {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(
        'Удалять можно только свои собственные подарки',
      );
    }

    return this.wishesRepository.delete(wishId);
  }

  async copyOne(userId: number, wishId: number) {
    const { name, link, image, price, description } = await this.findOne(
      wishId,
    );

    const existingCopy = await this.wishesRepository.findOne({
      where: {
        owner: { id: userId },
        name,
        link,
        image,
        price,
        description,
      },
    });

    if (existingCopy) {
      throw new BadRequestException('Вы уже копировали себе этот подарок');
    }

    await this.wishesRepository.increment({ id: wishId }, 'copied', 1);

    const copiedWish = this.wishesRepository.create({
      name,
      link,
      image,
      price,
      description,
      owner: { id: userId },
    });

    await this.wishesRepository.save(copiedWish);

    return {};
  }
}
