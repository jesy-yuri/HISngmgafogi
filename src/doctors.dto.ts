export class CreateDoctorDto {
  name: string;
  specialty?: string;
}

export class UpdateDoctorDto {
  name?: string;
  specialty?: string;
}
