// chronicles/dto/create-chronicle.dto.ts
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateChronicleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  content: string;

}