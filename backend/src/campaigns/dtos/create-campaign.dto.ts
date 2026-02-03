/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  MaxLength,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { CampaignStatus } from '../schemas/campaign.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAfter',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (!value || !relatedValue) return true;
          return new Date(value) > new Date(relatedValue);
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} doit être après ${relatedPropertyName}`;
        },
      },
    });
  };
}

export class CreateCampaignDto {
  @ApiProperty({
    description: 'Nom de la campagne',
    example: 'Campagne Noël 2026',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Le nom de la campagne est requis' })
  @MaxLength(100, {
    message: 'Le nom de la campagne ne peut pas dépasser 100 caractères',
  })
  name: string;

  @ApiProperty({
    description: 'Nom de l’annonceur',
    example: 'Nike',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'L’annonceur est requis' })
  @MaxLength(50, { message: 'L’annonceur ne peut pas dépasser 50 caractères' })
  advertiser: string;

  @ApiProperty({
    description: 'Budget total de la campagne (en euros)',
    example: 5000,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Le budget doit être un nombre' })
  @Min(0, { message: 'Le budget doit être supérieur ou égal à 0' })
  budget: number;

  @ApiProperty({
    description: 'Date de début de la campagne (ISO 8601)',
    example: '2026-12-01',
  })
  @IsDateString(
    {},
    { message: 'La date de début doit être une date valide ISO 8601' },
  )
  startDate: string;

  @ApiProperty({
    description:
      'Date de fin de la campagne (ISO 8601), doit être après startDate',
    example: '2026-12-31',
  })
  @IsDateString(
    {},
    { message: 'La date de fin doit être une date valide ISO 8601' },
  )
  @IsAfter('startDate', {
    message: 'La date de fin doit être après la date de début',
  })
  endDate: string;

  @ApiPropertyOptional({
    description: `Statut de la campagne`,
    example: CampaignStatus.ACTIVE,
    enum: CampaignStatus,
  })
  @IsOptional()
  @IsEnum(CampaignStatus, {
    message: `Le status doit être l’un de ${Object.values(CampaignStatus).join(', ')}`,
  })
  status?: CampaignStatus;

  @ApiPropertyOptional({
    description: 'Nombre d’impressions initial',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Les impressions doivent être un nombre' })
  @Min(0, { message: 'Les impressions ne peuvent pas être négatives' })
  impressions?: number;

  @ApiPropertyOptional({
    description: 'Nombre de clics initial',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Les clics doivent être un nombre' })
  @Min(0, { message: 'Les clics ne peuvent pas être négatifs' })
  clicks?: number;
}
