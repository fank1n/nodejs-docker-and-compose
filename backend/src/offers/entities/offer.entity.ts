import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { BasicEntity } from 'src/utils/basic.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer extends BasicEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'bool',
    default: false,
  })
  hidden: boolean;
}
