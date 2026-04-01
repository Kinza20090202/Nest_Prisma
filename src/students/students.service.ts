import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: { id?: number; nis?: string; name?: string }) {
  return this.prisma.students.findMany({
    where: {
      id: filter.id,
      nis: { contains: filter.nis },
      name: { contains: filter.name }, // "contains" agar bisa cari nama sebagian (like)
    },
  });
}

  async create(dto: CreateStudentDto) {
    return this.prisma.students.create({ data: dto });
  }


  async findOne(id: number) {
    const student = await this.prisma.students.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: number, dto: UpdateStudentDto) {
    // pastikan ada dulu
    await this.findOne(id);
    return this.prisma.students.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    // pastikan ada dulu
    await this.findOne(id);
    return this.prisma.students.delete({ where: { id } });
  }
}
