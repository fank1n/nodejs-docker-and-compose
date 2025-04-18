import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { HashModule } from 'src/hash/hash.module';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [
    HashModule,
    TypeOrmModule.forFeature([User, Wish]),
    forwardRef(() => WishesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
