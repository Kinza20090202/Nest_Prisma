import { BadRequestException, Injectable, NotFoundException } from
  '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  findFiltered(title: string | undefined, author: string | undefined) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) { }
  async create(dto: CreateBookDto) {
    return this.prisma.book.create({ data: dto });
  }

  // Tambahkan id di dalam kurung kurawal params
async findAll(params: { id?: number; title?: string; author?: string }) {
  const { id, title, author } = params;

  return this.prisma.book.findMany({
    where: {
      id: id ? id : undefined, // Pastikan namanya 'id', bukan '_id'
      title: title ? { contains: title } : undefined,
      author: author ? { contains: author } : undefined,
    },
  });
}
  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }
  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);
    return this.prisma.book.update({
      where: { id },
      data: dto,
    });
  }
  async remove(id: number) {
  try {
    return await this.prisma.book.delete({
      where: { id: id },
    });
  } catch (error) {
    throw new BadRequestException('Gagal menghapus buku. Pastikan ID benar atau buku tidak sedang dipinjam.');
  }
}
}