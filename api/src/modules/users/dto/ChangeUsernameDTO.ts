import { IsNotEmpty, Matches, MinLength } from "class-validator";

export class ChangeUsernameDTO {
  @IsNotEmpty({ message: "username: Username is required" })
  username!: string;

  @IsNotEmpty({ message: "newUsername: New username is required" })
  @MinLength(6, {
    message: "newUsername: Username must be at least 6 characters",
  })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: "newUsername: Username must contain only letters and numbers",
  })
  newUsername!: string;
}
