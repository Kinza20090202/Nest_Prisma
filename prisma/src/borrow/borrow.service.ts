import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';

@Injectable()
export class BorrowService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE: Membuat peminjaman baru
  async create(dto: CreateBorrowDto) {
  try {
    return await this.prisma.borrowing.create({
      data: {
        studentId: dto.studentId,
        bookId: dto.bookId,
        status: 'BORROWED',
        // Jika dto.borrowDate ada, gunakan itu. Jika tidak, pakai tanggal sekarang.
        borrowDate: dto.borrowDate ? new Date(dto.borrowDate) : new Date(),
      },
      include: { student: true, book: true },
    });
  } catch (error) {
    throw new BadRequestException('Gagal memproses peminjaman. Pastikan ID Siswa dan Buku benar.');
  }
}

  // 2. FIND ALL & FILTER: Mengambil semua data atau berdasarkan ID/Date
  async findAll(filter?: { id?: number; date?: string }) {
    return await this.prisma.borrowing.findMany({
      where: {
        id: filter?.id ? filter.id : undefined,
        borrowDate: filter?.date ? {
          gte: new Date(filter.date + "T00:00:00.000Z"),
          lte: new Date(filter.date + "T23:59:59.999Z"),
        } : undefined,
      },
      include: { student: true, book: true },
      orderBy: { borrowDate: 'desc' }
    });
  }

  // 3. FIND ONE: Detail transaksi berdasarkan ID
  async findOne(id: number) {
    const data = await this.prisma.borrowing.findUnique({
      where: { id },
      include: { student: true, book: true },
    });
    if (!data) throw new BadRequestException('Data peminjaman tidak ditemukan.');
    return data;
  }

  // 4. RETURN BOOK: Mengembalikan buku berdasarkan ID Buku
  async returnBookByBookId(bookId: number) {
    const activeBorrow = await this.prisma.borrowing.findFirst({
      where: { bookId, status: 'BORROWED' },
    });

    if (!activeBorrow) {
      throw new BadRequestException('Buku ini tidak sedang dipinjam.');
    }

    return await this.prisma.borrowing.update({
      where: { id: activeBorrow.id },
      data: {
        status: 'RETURNED',
        returnDate: new Date(),
      },
    });
  }

  // 5. UPDATE & REMOVE (CRUD Standar)
  async update(id: number, dto: any) {
    return await this.prisma.borrowing.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return await this.prisma.borrowing.delete({ where: { id } });
  }
}