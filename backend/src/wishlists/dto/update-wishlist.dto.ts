import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsOptional()
  @IsString()
  @MinLength(1, {
    message: 'Название списка не может быть короче 1-го символа',
  })
  @MaxLength(250, {
    message: 'Название списка не может быть длиннее 250 символов',
  })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1500, {
    message: 'Описание подборки не может быть длиннее 1500 символов',
  })
  description: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  items: number[];
}
