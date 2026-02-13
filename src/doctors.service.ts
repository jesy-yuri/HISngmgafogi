import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctors.entity';
import { CreateDoctorDto, UpdateDoctorDto } from './doctors.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepo: Repository<Doctor>,
  ) {}

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    const d = this.doctorsRepo.create(dto as any);
    const saved = await this.doctorsRepo.save(d as any);
    return saved as Doctor;
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorsRepo.find();
  }

  async findOne(id: number): Promise<Doctor> {
    const d = await this.doctorsRepo.findOne({ where: { id } });
    if (!d) throw new NotFoundException('Doctor not found');
    return d;
  }

  async update(id: number, dto: UpdateDoctorDto): Promise<Doctor> {
    const d = await this.findOne(id);
    Object.assign(d, dto);
    const saved = await this.doctorsRepo.save(d as any);
    return saved as Doctor;
  }

  async remove(id: number): Promise<{ message: string }> {
    const d = await this.findOne(id);
    await this.doctorsRepo.remove(d);
    return { message: `Doctor ${id} removed` };
  }
}
