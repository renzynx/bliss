import {
  IsBoolean,
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
    message: "embedSite: Embed site name must be at 200 characters or less.",
  })
  embedSite: string | null;

  @IsOptional()
  @IsUrl({ message: "embedSiteUrl: Embed site url must be a valid url." })
  embedSiteUrl: string | null;

  @IsOptional()
  @MaxLength(200, {
    message: "embedAuthor: Embed author must be at 200 characters or less.",
  })
  embedAuthor: string | null;

  @IsOptional()
  @IsUrl({ message: "embedAuthorUrl: Embed author url must be a valid url." })
  embedAuthorUrl: string | null;

  @IsOptional()
  @MaxLength(200, {
    message: "title: Embed author must be at 200 characters or less.",
  })
  title: string | null;

  @IsOptional()
  @MaxLength(1800, {
    message: "description: Embed description must be 1800 characters or less.",
  })
  description: string | null;

  @IsOptional()
  @IsHexColor({ message: "color: Color must be a hex color." })
  color: string | null;
}
