import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Patient } from './patients.entity';
import { Doctor } from './doctors.entity';
import { Appointment } from './appointments.entity';

import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [
    // Ginamit natin yung MYSQL_URL mo para mas mabilis mag-connect sa Railway
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.MYSQL_URL, // <--- GAGAMITIN NATIN YUNG MUNGKAHI MO!
      autoLoadEntities: true,
      synchronize: true,
    }),

    TypeOrmModule.forFeature([Patient, Doctor, Appointment]),
  ],
  controllers: [PatientsController, DoctorsController, AppointmentsController],
  providers: [PatientsService, DoctorsService, AppointmentsService],
})
export class AppModule {}
