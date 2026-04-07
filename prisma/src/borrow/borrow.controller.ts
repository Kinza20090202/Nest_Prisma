import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  Query, UseGuards, ParseIntPipe 
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  @Roles('ADMIN', 'STUDENTS')
  create(@Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowService.create(createBorrowDto);
  }

  @Get()
  @Roles('ADMIN', 'PETUGAS')
  findAll(
    @Query('id') id?: string,
    @Query('date') date?: string,
  ) {
    return this.borrowService.findAll({ 
      id: id ? +id : undefined, 
      date 
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.borrowService.findOne(id);
  }

  @Patch('return/:bookId')
  async returnBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.borrowService.returnBookByBookId(bookId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'PETUGAS')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBorrowDto: any) {
    return this.borrowService.update(id, updateBorrowDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.borrowService.remove(id);
  }
}