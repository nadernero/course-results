
export interface StudentResult {
  code: string;
  name: string;
  mobileNumber: string;
  service: string;
  score: number | 'غائب';
  attendance: number;
}