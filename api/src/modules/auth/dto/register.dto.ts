import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsAlphanumeric,
  IsOptional,
  Matches,
} from "class-validator";

export class RegisterDTO {
  @IsNotEmpty({ message: "email: Email must not be empty" })
  @IsEmail({}, { message: "email: Email is invalid" })
  email: string;

  @IsNotEmpty({ message: "password: Password is required" })
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
  password: string;
}
