"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const patients_entity_1 = require("./patients.entity");
const doctors_entity_1 = require("./doctors.entity");
const appointments_entity_1 = require("./appointments.entity");
const patients_controller_1 = require("./patients.controller");
const patients_service_1 = require("./patients.service");
const doctors_controller_1 = require("./doctors.controller");
const doctors_service_1 = require("./doctors.service");
const appointments_controller_1 = require("./appointments.controller");
const appointments_service_1 = require("./appointments.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // Allow an easy local fallback to SQLite when USE_SQLITE=true is set.
            // This makes the demo runnable without a MySQL server.
            typeorm_1.TypeOrmModule.forRoot(process.env.USE_SQLITE === 'true'
                ? {
                    type: 'sqlite',
                    database: process.env.SQLITE_DB || 'hms_demo.sqlite',
                    entities: [patients_entity_1.Patient, doctors_entity_1.Doctor, appointments_entity_1.Appointment],
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
                    entities: [patients_entity_1.Patient, doctors_entity_1.Doctor, appointments_entity_1.Appointment],
                    synchronize: true,
                    logging: true,
                }),
            typeorm_1.TypeOrmModule.forFeature([patients_entity_1.Patient, doctors_entity_1.Doctor, appointments_entity_1.Appointment]),
        ],
        controllers: [patients_controller_1.PatientsController, doctors_controller_1.DoctorsController, appointments_controller_1.AppointmentsController],
        providers: [patients_service_1.PatientsService, doctors_service_1.DoctorsService, appointments_service_1.AppointmentsService],
    })
], AppModule);
