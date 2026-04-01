import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
constructor(
private prisma: PrismaService,
private jwtService: JwtService,
) {}
async login(username: string, password: string) {
const user = await this.prisma.user.findUnique({
where: { username },
include: { student: true },
});
if (!user) {
throw new UnauthorizedException('Username tidak ditemukan');
}
const passwordValid = await bcrypt.compare(password, user.password);
if (!passwordValid) {
throw new UnauthorizedException('Password salah');
}

const payload = {
sub: user.studentId || user.id,
username: user.username,
role: user.role,
memberId: user.studentId,
};

return {
message: 'Login berhasil',
access_token: this.jwtService.sign(payload),
};
}
async register(dto: LoginDto) {
  // Enkripsi password sebelum disimpan [cite: 36, 91]
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  return await this.prisma.user.create({
    data: {
      username: dto.username,
      password: hashedPassword,
      role: 'ADMIN', // Kamu bisa ubah default role-nya di sini
    },
  });
}
// src/auth/auth.service.ts

async registerStudent(username: string, password: string, studentId: any) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        role: 'STUDENTS',
        studentId: Number(studentId), // Memastikan ID adalah angka
      },
    });
  } catch (error) {
    console.log(error); // Agar error muncul di terminal VS Code
    throw new Error('Gagal registrasi: ' + error.message);
  }
}
// src/auth/auth.service.ts

async registerEmployee(username: string, password: string, role: 'ADMIN' | 'PETUGAS') {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: role, // Masukkan role sesuai input
      },
    });
  } catch (error) {
    throw new Error('Gagal registrasi petugas/admin: ' + error.message);
  }
}
}