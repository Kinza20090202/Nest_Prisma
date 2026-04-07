import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Books')
@ApiBearerAuth()
@Controller('books')

export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiOperation({ summary: 'Menampilkan seluruh data buku' })
  findAll() {
   return this.bookService.findAll({});;
  }

  @Get('search')
  @ApiOperation({ summary: 'Mencari buku berdasarkan title/author' })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'author', required: false, type: String })
  search(@Query('title') title?: string, @Query('author') author?: string) {
    return this.bookService.findFiltered(title, author);
  }
  
  @Post()
  @ApiOperation({ summary: 'Menambahkan buku (ADMIN only)' })
  @Roles('ADMIN', 'PETUGAS')
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'PETUGAS')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @UseGuards(JwtAuthGuard)
@Delete(':id')
@Roles('ADMIN')
async remove(@Param('id') id: string) {
  return {
    statusCode: 200,
    message: `Buku dengan ID ${id} berhasil dihapus dari sistem`,
  };
}
}
