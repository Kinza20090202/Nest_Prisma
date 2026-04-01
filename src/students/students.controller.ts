import { Controller, Get, Post, Body, Put, Param, Delete, Query, Req, ForbiddenException, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../auth//guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
  @Get()
  @Roles('ADMIN')
  findAll(
    @Query('id') id?: string,
    @Query('nis') nis?: string,
    @Query('name') name?: string,
  ) {
    return this.studentsService.findAll({ 
      id: id ? +id : undefined, 
      nis, 
      name 
    });
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string, 
    @Body() updateStudentDto: UpdateStudentDto,
    @Req() req: any // <--- Bagian ini WAJIB ada (Decorator @Req() dan nama variabel req)
  ) {

    console.log('ID dari URL:', id);
    console.log('User dari Token:', req.user);
    // Sekarang variabel 'req' sudah terdaftar di parameter atas, jadi tidak akan error lagi
    if (req.user.role === 'STUDENTS' && Number(req.user.userId) !== Number(id)) {
   throw new ForbiddenException('Kamu hanya boleh mengubah data dirimu sendiri!');
}
    
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(Number(id));
  }
}
