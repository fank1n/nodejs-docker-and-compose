import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { BasicEntity } from 'src/utils/basic.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends BasicEntity {
  @Column({
    type: 'varchar',
  })
  @Length(1, 250)
  name: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  link: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  image: string;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
    scale: 2,
    default: 0,
  })
  raised: number;

  @Column({
    type: 'varchar',
  })
  @Length(1, 1024)
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist[];

  @Column({
    type: 'integer',
    default: 0,
  })
  copied: number;
}
