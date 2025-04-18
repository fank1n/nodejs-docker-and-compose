import {
  IsArray,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @MinLength(1, {
    message: 'Название списка не может быть короче 1-го символа',
  })
  @MaxLength(250, {
    message: 'Название списка не может быть длиннее 250 символов',
  })
  name: string;

  @IsString()
  @MaxLength(1500, {
    message: 'Описание подборки не может быть длиннее 1500 символов',
  })
  description: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  items: number[];
}
