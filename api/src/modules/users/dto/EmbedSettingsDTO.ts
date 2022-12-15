import {
  IsBoolean,
  IsHexColor,
  IsNotEmpty,
  IsUrl,
  MaxLength,
} from "class-validator";

export class EmbedSettingDTO {
  @IsBoolean({ message: "enabled: Value must be a boolean." })
  enabled: boolean;

  @MaxLength(200, {
    message: "embedSite: Embed site name must be at 200 characters or less.",
  })
  embedSite: string | null;

  @IsUrl({ message: "embedSiteUrl: Embed site url must be a valid url." })
  embedSiteUrl: string | null;

  @MaxLength(200, {
    message: "embedAuthor: Embed author must be at 200 characters or less.",
  })
  embedAuthor: string | null;

  @IsUrl({ message: "embedAuthorUrl: Embed author url must be a valid url." })
  embedAuthorUrl: string | null;

  @MaxLength(200, {
    message: "title: Embed author must be at 200 characters or less.",
  })
  title: string | null;

  @MaxLength(1800, {
    message: "description: Embed description must be 1800 characters or less.",
  })
  description: string | null;

  @IsHexColor({ message: "color: Color must be a hex color." })
  color: string | null;

  @IsNotEmpty({ message: "userId: User ID must not be empty." })
  userId: string;
}
