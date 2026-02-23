"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointments_entity_1 = require("./appointments.entity");
const patients_entity_1 = require("./patients.entity");
const doctors_entity_1 = require("./doctors.entity");
let AppointmentsService = class AppointmentsService {
    constructor(apptRepo, patientRepo, doctorRepo) {
        this.apptRepo = apptRepo;
        this.patientRepo = patientRepo;
        this.doctorRepo = doctorRepo;
    }
    async create(dto) {
        const patient = await this.patientRepo.findOne({ where: { id: dto.patientId } });
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        const appt = this.apptRepo.create({ datetime: dto.datetime, patient });
        if (dto.doctorId) {
            const doc = await this.doctorRepo.findOne({ where: { id: dto.doctorId } });
            if (!doc)
                throw new common_1.NotFoundException('Doctor not found');
            appt.doctor = doc;
        }
        const saved = await this.apptRepo.save(appt);
        return saved;
    }
    async findAll() {
        return this.apptRepo.find({ relations: ['patient', 'doctor'] });
    }
    async findOne(id) {
        const a = await this.apptRepo.findOne({ where: { id }, relations: ['patient', 'doctor'] });
        if (!a)
            throw new common_1.NotFoundException('Appointment not found');
        return a;
    }
    async update(id, dto) {
        const a = await this.findOne(id);
        Object.assign(a, dto);
        const saved = await this.apptRepo.save(a);
        return saved;
    }
    async remove(id) {
        const a = await this.findOne(id);
        await this.apptRepo.remove(a);
        return { message: `Appointment ${id} removed` };
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointments_entity_1.Appointment)),
    __param(1, (0, typeorm_1.InjectRepository)(patients_entity_1.Patient)),
    __param(2, (0, typeorm_1.InjectRepository)(doctors_entity_1.Doctor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AppointmentsService);
