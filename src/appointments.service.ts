import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointments.entity';
import { CreateAppointmentDto, UpdateAppointmentDto } from './appointments.dto';
import { Patient } from './patients.entity';
import { Doctor } from './doctors.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private apptRepo: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const patient = await this.patientRepo.findOne({ where: { id: dto.patientId } });
    if (!patient) throw new NotFoundException('Patient not found');
    const appt = this.apptRepo.create({ datetime: dto.datetime, patient } as any);
    if (dto.doctorId) {
      const doc = await this.doctorRepo.findOne({ where: { id: dto.doctorId } });
      if (!doc) throw new NotFoundException('Doctor not found');
      (appt as any).doctor = doc;
    }
    const saved = await this.apptRepo.save(appt as any);
    return saved as Appointment;
  }

  async findAll(): Promise<Appointment[]> {
    return this.apptRepo.find({ relations: ['patient', 'doctor'] });
  }

  async findOne(id: number): Promise<Appointment> {
    const a = await this.apptRepo.findOne({ where: { id }, relations: ['patient', 'doctor'] });
    if (!a) throw new NotFoundException('Appointment not found');
    return a;
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
    const a = await this.findOne(id);
    Object.assign(a, dto as any);
    const saved = await this.apptRepo.save(a as any);
    return saved as Appointment;
  }

  async remove(id: number): Promise<{ message: string }> {
    const a = await this.findOne(id);
    await this.apptRepo.remove(a);
    return { message: `Appointment ${id} removed` };
  }
}
