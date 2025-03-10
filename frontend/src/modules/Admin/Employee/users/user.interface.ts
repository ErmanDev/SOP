import { StringValidation } from "zod";

export default interface IUser {
  employeeId: string;
  employee_name: string;
  department: string;
  position: string;
  profile_url: string;
  status: string;

  
  overtime: string;
  allowance: number;
  deductions: string;
  epf: string;
  socso: string;
  netSalary: string;
  paymentDate: string;
  id: string; 


  user_id?: string;


  first_name: string;
  last_name: string;
  middle_name?: string;
  salary: number;
  address: string;
  contact: IEmergencyContact;


  email: string;
  password: string;
  confirmPassword: string;

  createdAt: string;
  updatedAt: string;

  userRole?: string;
}

interface IEmergencyContact {
  name: string;
  contactNumber: string
}
