export class CreateAppointmentDto {
  patientId: number;
  doctorId?: number;
  datetime: string; // ISO or datetime-local string
}

export class UpdateAppointmentDto {
  datetime?: string;
  status?: string;
}
