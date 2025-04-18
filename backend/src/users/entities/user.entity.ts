import { Column, Entity, OneToMany } from 'typeorm';
import { Length } from 'class-validator';
import { BasicEntity } from 'src/utils/basic.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class User extends BasicEntity {
  @Column({
    type: 'varchar',
    unique: true,
  })
  @Length(2, 30)
  username: string;

  @Column({
    type: 'varchar',
    default: 'Пока ничего не рассказал о себе',
  })
  @Length(2, 200)
  about: string;

  @Column({
    type: 'varchar',
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wish) => wish.id)
  wishlists: Wishlist[];

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];
}
