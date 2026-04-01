import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module'; 
import { BookModule } from './book/book.module';
import { BorrowModule } from './borrow/borrow.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
ConfigModule.forRoot({
isGlobal: true,
envFilePath:
process.env.NODE_ENV === 'production'
? '.env.production'
: '.env',
}),    
    PrismaModule, 
    StudentsModule, BookModule, BorrowModule, AuthModule
  ], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 