import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*', '/patients*', '/doctors*', '/appointments*'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'hms_demo',
      entities: [Patient, Doctor, Appointment],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Patient, Doctor, Appointment]),
  ],
  controllers: [PatientsController, DoctorsController, AppointmentsController],
  providers: [PatientsService, DoctorsService, AppointmentsService],
})
export class AppModule {}
