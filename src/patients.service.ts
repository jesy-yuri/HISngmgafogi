import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patients.entity';
import { CreatePatientDto, UpdatePatientDto } from './patients.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepo: Repository<Patient>,
  ) {}

  async create(dto: CreatePatientDto): Promise<Patient> {
    const p = this.patientsRepo.create(dto as any);
    const saved = await this.patientsRepo.save(p as any);
    return saved as Patient;
  }

  async findAll(): Promise<Patient[]> {
    return this.patientsRepo.find();
  }

  async findOne(id: number): Promise<Patient> {
    const p = await this.patientsRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Patient not found');
    return p;
  }

  async update(id: number, dto: UpdatePatientDto): Promise<Patient> {
    const p = await this.findOne(id);
    Object.assign(p, dto);
    const saved = await this.patientsRepo.save(p as any);
    return saved as Patient;
  }

  async remove(id: number): Promise<{ message: string }> {
    const p = await this.findOne(id);
    await this.patientsRepo.remove(p);
    return { message: `Patient ${id} removed` };
  }
}
