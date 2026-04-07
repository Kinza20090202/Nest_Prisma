import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}
@Post('login')
@ApiOperation({ summary: 'Login user dan menghasilkan JWT token' })
login(@Body() dto: LoginDto) {
return this.authService.login(dto.username, dto.password);
}
@Post('register')
register(@Body() dto: LoginDto) {
return this.authService.register(dto);
}
// src/auth/auth.controller.ts

@Post('register/student')
@ApiOperation({ summary: 'Login student dan menghasilkan JWT token' })
registerStudent(@Body() body: any) {
  return this.authService.registerStudent(
    body.username, 
    body.password, 
    Number(body.studentId) // Paksa konversi ke Number di sini
  );
}
// src/auth/auth.controller.ts

@Post('register/employee')
async registerEmployee(
  @Body() body: { username: string; password: string; role: 'ADMIN' | 'PETUGAS' }
) {
  return this.authService.registerEmployee(body.username, body.password, body.role);
}
}