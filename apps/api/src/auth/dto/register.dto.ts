import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsAlphanumeric,
} from 'class-validator';

export class RegisterDTO {
  @IsEmail()
  @IsOptional()
  public email: string;

  @IsString()
  @MaxLength(40)
  @MinLength(3)
  @IsNotEmpty()
  @IsAlphanumeric()
  public username: string;

  @IsString()
  @MaxLength(40)
  @MinLength(8)
  @IsNotEmpty()
  public password: string;
}
