export class CreatePatientDto {
  name: string;
  email?: string;
  notes?: string;
}

export class UpdatePatientDto {
  name?: string;
  email?: string;
  notes?: string;
}
