import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // 1. Tambahkan ini
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy'; // 2. Tambahkan ini
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule, // 3. Daftarkan PassportModule
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
    useFactory: () => ({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
    }),
  }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    PrismaService, 
    JwtStrategy // 4. Daftarkan JwtStrategy di sini
  ],
  exports: [AuthService], // Opsional, jika AuthService dibutuhkan module lain
})
export class AuthModule {}