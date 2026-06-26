// chronicles/dto/create-chronicle.dto.ts
import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

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


  @IsString()
  @IsOptional() // Lo ponemos opcional por si subes crónicas antiguas sin archivo
  file_path?: string;



  @IsOptional() 
  @IsString()
  correo?:            string;

  @IsOptional() 
    @IsString()
  materia?:           string;

  @IsOptional() 
    @IsString()
  palabras_claves?:   string;

  @IsOptional() 
    @IsString()
  year_presentacion?: string;
}