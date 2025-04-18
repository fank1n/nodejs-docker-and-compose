import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(userId: number, createWishlistDto: CreateWishlistDto) {
    const { items } = createWishlistDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const wishes = await this.wishRepository.findBy({
      id: In(items),
    });

    if (wishes.length !== items.length) {
      throw new NotFoundException('Один или несколько подарков не найдены');
    }

    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });

    return this.wishlistRepository.save(wishlist);
  }

  findAll() {
    return this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  findOne(wishlistId: number) {
    return this.wishlistRepository.findOne({
      where: { id: wishlistId },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async updateOne(
    userId: number,
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: wishlistId },
      relations: { owner: true },
    });

    if (!wishlist) {
      throw new NotFoundException('Список не найден');
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Редактировать можно только свои вишлисты');
    }

    const { items, ...rest } = updateWishlistDto;
    const wishes = await this.wishRepository.findBy({
      id: In(items),
    });

    Object.assign(wishlist, rest);

    wishlist.items = wishes;

    return this.wishlistRepository.save(wishlist);
  }

  async removeOne(userId: number, wishlistId: number) {
    const wishlist = await this.findOne(wishlistId);

    if (!wishlist) {
      throw new NotFoundException('Список не найден');
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Запрещено удалять чужие списки');
    }

    await this.wishlistRepository.delete(wishlistId);

    return wishlist;
  }
}
