export default interface IUser {
  employeeId: string;
  department: string;
  position: string;
  basicSalary: string;
  overtime: string;
  allowances: string;
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
  address: string;
  emergency_contact: IEmergencyContact;
  profile_url?: string | File;

  email: string;
  password: string;
  confirmPassword: string;

  createdAt: string;
  updatedAt: string;

  userRole?: string;
}

interface IEmergencyContact {
  name: string;
  contactNumber: number;
}
