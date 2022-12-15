import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDTO {
  @IsNotEmpty({ message: "password: Password is required" })
  password!: string;

  @IsNotEmpty({ message: "newPassword: New password is required" })
  @MinLength(6, { message: "password: Password must be at least 6 characters" })
  @MaxLength(40, { message: "password: Password is too long" })
  @Matches(/^(?=.*[a-z])/, {
    message: "password: Password must contain at least 1 lowercase letter",
  })
  @Matches(/^(?=.*[A-Z])/, {
    message: "password: Password must contain at least 1 uppercase letter",
  })
  @Matches(/^(?=.*[0-9])/, {
    message: "password: Password must contain at least 1 number",
  })
  @Matches(/^(?=.*[!@#$%^&*])/, {
    message: "password: Password must contain at least 1 special character",
  })
  newPassword!: string;
}
