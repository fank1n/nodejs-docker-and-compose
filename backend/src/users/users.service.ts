import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async findOne(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException(`Пользователь ${username} не найден`);
    }

    return user;
  }

  async removeOne(id: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new ForbiddenException(`Удаляемый пользователь не найден`);
    }

    return this.usersRepository.delete(id);
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const user = await this.findById(id);

    const isUserWithSameEmailOrUsernameExist = await this.findByEmailOrUsername(
      updateUserDto.email,
      updateUserDto.username,
    );

    if (isUserWithSameEmailOrUsernameExist.length) {
      throw new ForbiddenException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }

    if (password) {
      updateUserDto.password = await this.hashService.hash(password);
    }

    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    const passwordHash = await hash(password, 10);

    const newUser = this.usersRepository.create({
      ...rest,
      password: passwordHash,
    });
    return await this.usersRepository.save(newUser);
  }

  async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<User[]> {
    return this.usersRepository.find({
      where: [{ email: email }, { username: username }],
    });
  }

  async findMany(query: string) {
    return await this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async getUserWishesById(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { wishes: true, offers: true },
    });

    return user.wishes;
  }

  async getUserWishesByName(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: { wishes: true },
      select: { wishes: true },
    });

    return user.wishes;
  }
}
