import {
  IsBoolean,
  IsEmpty,
  IsHexColor,
  IsOptional,
  IsUrl,
  MaxLength,
} from "class-validator";

export class EmbedSettingDTO {
  @IsOptional()
  enabled: boolean;

  @IsOptional()
  @MaxLength(200, {
    message:
      "provider_name: Embed site name must be at 200 characters or less.",
  })
  provider_name: string | null;

  @IsOptional()
  @IsUrl()
  provider_url: string | null;

  @IsOptional()
  @MaxLength(200)
  author_name: string | null;

  @IsOptional()
  @IsUrl()
  author_url: string | null;

  @IsOptional()
  @MaxLength(200)
  title: string | null;

  @IsOptional()
  @MaxLength(1800)
  description: string | null;

  @IsOptional()
  @IsHexColor()
  color: string | null;
}
