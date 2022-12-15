import { IsNotEmpty } from "class-validator";

export class LoginDTO {
  @IsNotEmpty({ message: "username_email: Username or email is required" })
  username_email: string;

  @IsNotEmpty({ message: "password: Password is required" })
  password: string;
}
