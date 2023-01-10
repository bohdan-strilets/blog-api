import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
  IsArray,
  IsPostalCode,
  IsObject,
  IsNotEmptyObject,
  ArrayUnique,
  IsUrl,
} from 'class-validator';

class Adress {
  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  @IsPostalCode()
  postcode: string;
}

class SocialMedia {
  @IsString()
  @IsUrl()
  facebook: string;

  @IsString()
  @IsUrl()
  instagram: string;

  @IsString()
  @IsUrl()
  linkedin: string;

  @IsString()
  @IsUrl()
  twitter: string;

  @IsString()
  @IsUrl()
  github: string;
}

export class ChangeProfileDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  lastName: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  dateBirth: string;

  @IsString()
  @IsIn(['man', 'woman', 'other'])
  @IsOptional()
  gender: 'man' | 'woman' | 'other';

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  adress: Adress;

  @IsOptional()
  @IsObject()
  @IsNotEmptyObject()
  socialMedia: SocialMedia;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  profession: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  @ArrayUnique()
  hobby: string[];
}
