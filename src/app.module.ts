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
    // Serve static frontend files (HTML, CSS, JS) from the public folder
    // The frontend/ folder needs to be copied to dist/public during build
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/*', '/patients*', '/doctors*', '/appointments*'],  // Let API controllers handle these
    }),

    // Allow an easy local fallback to SQLite when USE_SQLITE=true is set.
    // This makes the demo runnable without a MySQL server.
    TypeOrmModule.forRoot(
      process.env.USE_SQLITE === 'true'
        ? {
            type: 'sqlite',
            database: process.env.SQLITE_DB || 'hms_demo.sqlite',
            entities: [Patient, Doctor, Appointment],
            synchronize: true,
            logging: true,
          }
        : {
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            username: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'hms_demo',
            entities: [Patient, Doctor, Appointment],
            synchronize: true,
            logging: true,
          },
    ),

    TypeOrmModule.forFeature([Patient, Doctor, Appointment]),
  ],
  controllers: [PatientsController, DoctorsController, AppointmentsController],
  providers: [PatientsService, DoctorsService, AppointmentsService],
})
export class AppModule {}
