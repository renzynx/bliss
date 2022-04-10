import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  public username_email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
