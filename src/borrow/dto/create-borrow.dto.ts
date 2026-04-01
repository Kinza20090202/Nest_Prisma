import { IsInt, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateBorrowDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @IsString()
  @IsOptional()
  status?: string;

  // Tambahkan ini agar bisa menerima input tanggal string (YYYY-MM-DD)
  @IsDateString()
  @IsOptional()
  borrowDate?: string; 
}