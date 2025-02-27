import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontalIcon, Search,  } from "lucide-react"
// import { useNavigate } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


// import { Spinner } from "@/components/spinner"
import { Badge } from "@/components/ui/badge"
import { useMemo, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import UserContentForm from "../Employee/users/user-content-form"
// import useReadUsers from "../Employee/users/hooks/useReadUsers"

const SAMPLE_PAYROLL_DATA = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    employeeId: "EMP-001",
    department: "IT",
    position: "Senior Developer",
    basicSalary: "5000",
    overtime: "500",
    allowances: "800",
    deductions: "300",
    epf: "600",
    socso: "50",
    insurance: "50",
    netSalary: "5350",
    paymentDate: "25/02/2024",
    status: "Paid",
    userImg: "https://avatars.githubusercontent.com/u/124599?v=4"
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    salary: "EMP-002",
    department: "HR",
    position: "HR Manager",
    basicSalary: "4500",
    overtime: "0",
    allowances: "600",
    deductions: "250",
    epf: "540",
    insurance: "45",
    netSalary: "4265",
    paymentDate: "25/02/2024",
    status: "Pending",
    userImg: "https://avatars.githubusercontent.com/u/124598?v=4"
    
  },
   {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    salary: "EMP-002",
    department: "HR",
    position: "HR Manager",
    basicSalary: "4500",
    overtime: "0",
    allowances: "600",
    deductions: "250",
    epf: "540",
    insurance: "45",
    netSalary: "4265",
    paymentDate: "25/02/2024",
    status: "Pending",
    userImg: "https://avatars.githubusercontent.com/u/124598?v=4"
    
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Johnson",
    employeeId: "EMP-003",
    department: "Sales",
    position: "Sales Executive",
    basicSalary: "3500",
    overtime: "300",
    holiday: "100",
    allowances: "500",
    deductions: "200",
    others: "50",
    accountNo: "1234567890",
    insurance: "35",
    netSalary: "3645",
    paymentDate: "25/02/2024",
    status: "Paid",
    userImg: "https://avatars.githubusercontent.com/u/124597?v=4"
  
  }
];

const ManagerList = () => {
  // const navigate = useNavigate();
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const { data:  isLoading, error } = useReadUsers();
  const Teams = [
    { id: 1, name: "North Team", address: "123 Health St", phone: "555-0101", hours: "8AM - 10PM" },
    { id: 2, name: "South Team", address: "456 Wellness Ave", phone: "555-0202", hours: "24/7" },
   
  ]

  const memoUsers = useMemo(() => {
    return SAMPLE_PAYROLL_DATA;
  }, []);

  const pagination = useMemo(() => ({
    currentPage: 1,
    totalPages: 1,
    totalDocs: SAMPLE_PAYROLL_DATA.length,
    limit: 10
  }), []);

  // const renderTableContent = () => {
  //   if (isLoading) {
  //     return (
  //       <TableRow>
  //         <TableCell colSpan={11} className="h-[400px] text-center">
  //           <Spinner className="mx-auto" />
  //           <span className="sr-only">Loading payroll data...</span>
  //         </TableCell>
  //       </TableRow>
  //     );
  //   }

  //   if (error) {
  //     return (
  //       <TableRow>
  //         <TableCell colSpan={15} className="h-[400px] text-center text-red-500">
  //           Error loading payroll data. Please try again later.
  //         </TableCell>
  //       </TableRow>
  //     );
  //   }

  //   return memoUsers.map((user) => (
  //     <TableRow key={user.id}>
  //       <TableCell className="hidden sm:table-cell">
  //         <img
  //           alt={`${user.firstName}'s avatar`}
  //           className="aspect-square rounded-md object-cover"
  //           height="64"
  //           src={user.userImg}
  //           width="64"
  //         />
  //       </TableCell>
  //       <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
  //       <TableCell>RM {user.basicSalary}</TableCell>
  //       <TableCell>RM {user.allowances}</TableCell>
  //       <TableCell>RM {user.holiday || "0"}</TableCell>
  //       <TableCell>RM {user.others || "0"}</TableCell>
  //       <TableCell className="bg-red-50">RM {user.insurance || "0"}</TableCell>
  //       <TableCell className="bg-red-50">RM {user.deductions || "0"}</TableCell>
  //       <TableCell className="bg-red-50">RM {user.deductions || "0"}</TableCell>
  //       <TableCell className="font-bold">RM {user.netSalary}</TableCell>
  //       <TableCell>{user.accountNo || "-"}</TableCell>
  //       <TableCell>
  //         <Badge 
  //           variant="outline" 
  //           className={user.status === 'Paid' ? 
  //             'bg-green-100 text-green-800' : 
  //             'bg-yellow-100 text-yellow-800'
  //           }
  //         >
  //           {user.status}
  //         </Badge>
  //       </TableCell>
  //       <TableCell>
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button
  //               aria-label={`Actions for ${user.firstName}`}
  //               size="icon"
  //               variant="ghost"
  //             >
  //               <MoreHorizontalIcon className="h-4 w-4" />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //             <DropdownMenuItem>View Slip</DropdownMenuItem>
  //             <DropdownMenuItem>Edit</DropdownMenuItem>
  //             <DropdownMenuItem>Download PDF</DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       </TableCell>
  //     </TableRow>
  //   ));
  // };

  return (
    <>
      <div className="flex items-center p-4">
        <div className="ml-auto flex items-center gap-2">
           <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            
          </div>

      
          <UserContentForm />
        </div>
      </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start ga">
              <div className="flex flex-col">
                <CardTitle className="text-[#492309]">Area Sales Manager Payroll </CardTitle>
                <CardDescription>
                  Manage your Area Sales Manager Payroll and view their profile.
                </CardDescription>
              </div>
              <div>
                <Select value={selectedPharmacy} onValueChange={setSelectedPharmacy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Teams</SelectItem>                                              
                    {Teams.map(pharmacy => (
                      <SelectItem key={pharmacy.id} value={pharmacy.name}>{pharmacy.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b-0">
                  <TableHead className="hidden w-[100px] sm:table-cell" rowSpan={2}>Image</TableHead>
                  <TableHead rowSpan={2}>Employee Name</TableHead>
                  <TableHead rowSpan={2}>Basic Salary</TableHead>
                  <TableHead rowSpan={2}>Allowances</TableHead>
                  <TableHead rowSpan={2}>Holiday</TableHead>
                  <TableHead rowSpan={2}>OTHERS</TableHead>
                  <TableHead className="text-center bg-red-50 text-red-800 border-b-0" colSpan={3}>
                    Deductions
                  </TableHead>
                  <TableHead rowSpan={2}>TOTAL</TableHead>
                  <TableHead rowSpan={2}>Account</TableHead>
                  <TableHead rowSpan={2}>Status</TableHead>
                  <TableHead rowSpan={2}>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="bg-red-50 text-red-800">Insurance</TableHead>
                  <TableHead className="bg-red-50 text-red-800">Others</TableHead>
                  <TableHead className="bg-red-50 text-red-800">Leave</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memoUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="hidden sm:table-cell">
                      <img
                        alt={`${user.firstName}'s avatar`}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={user.userImg}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                    <TableCell>RM {user.basicSalary}</TableCell>
                    <TableCell>RM {user.allowances}</TableCell>
                    <TableCell>RM {user.holiday || "0"}</TableCell>
                    <TableCell>RM {user.others || "0"}</TableCell>
                    <TableCell className="bg-red-50">RM {user.insurance || "0"}</TableCell>
                    <TableCell className="bg-red-50">RM {user.deductions || "0"}</TableCell>
                    <TableCell className="bg-red-50">RM {user.deductions || "0"}</TableCell>
                    <TableCell className="font-bold">RM {user.netSalary}</TableCell>
                    <TableCell>{user.accountNo || "-"}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={user.status === 'Paid' ? 
                          'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-label={`Actions for ${user.firstName}`}
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Slip</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              Showing <strong>{(pagination.currentPage - 1) * pagination.limit + 1}-{Math.min(pagination.currentPage * pagination.limit, pagination.totalDocs)}</strong> of <strong>{pagination.totalDocs}</strong> Users
            </div>
          </CardFooter>
        </Card>
    </>
  )
}

export default ManagerList
