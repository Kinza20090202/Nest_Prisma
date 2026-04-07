import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Tambahkan ini agar PrismaService bisa dipakai di mana saja
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Wajib diexport
})
export class PrismaModule {}