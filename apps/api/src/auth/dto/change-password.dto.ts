import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../lib/decorators';

export class ChangePasswordDTO {
  @IsNotEmpty()
  public old_password: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(40)
  @Match(ChangePasswordDTO, (s) => s.new_password_confirmation)
  public new_password: string;

  @Match(ChangePasswordDTO, (s) => s.new_password)
  public new_password_confirmation: string;
}
