import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { BasicEntity } from 'src/utils/basic.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Wishlist extends BasicEntity {
  @Column({
    type: 'varchar',
  })
  @Length(1, 250)
  name: string;

  @Column({
    type: 'varchar',
    default: '',
  })
  @Length(0, 1500)
  description: string;

  @Column({
    type: 'varchar',
  })
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.wishlist)
  @JoinTable()
  items: Wish[];
}
