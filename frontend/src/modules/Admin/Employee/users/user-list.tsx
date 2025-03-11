
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import IUser from './user.interface';

import { Spinner } from '@/components/spinner';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';
import useReadUsers from './hooks/useReadUsers';
import UserContentForm from './user-content-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


// Assume these functions make API calls to your backend

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const safeAccess = (obj: any, path: string) => {
//   return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : undefined, obj);
// };
type RoleColor = {
  [key in 'admin' | 'manager' | 'technician']: string;
};

const roleColors: RoleColor = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  manager:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  technician:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

const statusVariant = {
  active: 'success',
  inactive: 'destructive',
  suspended: 'secondary',
};

const RoleBadge = ({ role }: { role: string }) => {
  const color =
    role.toLowerCase() in roleColors
      ? roleColors[role.toLowerCase() as keyof RoleColor]
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  return (
    <Badge className={`${color} capitalize`} variant="outline">
      {role}
    </Badge>
  );
};

const UsersList = () => {

  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data: userDetails, isLoading, error } = useReadUsers();

  const memoUsers = useMemo(() => {
    if (!Array.isArray(userDetails)) return [];

    return userDetails
      .filter((user: IUser) => user.position?.toLowerCase() !== 'hr')
      .filter((user: IUser) =>
        user.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [userDetails, searchTerm]);

  const pagination = useMemo(() => {
    const currentPage = userDetails?.data?.currentPage?.page || 1;
    const totalPages = userDetails?.data?.totalPages || 1;
    const totalDocs = userDetails?.data?.totalDocs || 0;
    const limit = userDetails?.data?.currentPage?.limit || 20;

    return { currentPage, totalPages, totalDocs, limit };
  }, [userDetails]);

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-[400px] text-center">
            <Spinner className="mx-auto" />
            <span className="sr-only">Loading users...</span>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-[400px] text-center text-red-500">
            Error loading users. Please try again later.
          </TableCell>
        </TableRow>
      );
    }

    if (memoUsers.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={8}
            className="h-[400px] text-center text-md text-red"
          >
            No users found.
          </TableCell>
        </TableRow>
      );
    }

    return memoUsers.map((user: IUser) => (
      <TableRow key={user.user_id}>
        <TableCell className="sm:table-cell  flex justify-center items-center">
          <img
            alt={`${user.first_name}'s avatar`}
            className="aspect-square rounded-md object-cover"
            height="64"
            src={
              user.profile_url ||
              'https://grammedia-vids.s3.ap-southeast-2.amazonaws.com/boy.png'
            }
            width="64"
          />
        </TableCell>

        <TableCell className="font-light text-center">
          <span className=" font-bold text-md">{user.employee_name}</span>
        </TableCell>
        <TableCell className="font-light text-center">
          <span className=" font-bold text-md">{user.salary}</span>
        </TableCell>
        <TableCell className="font-light text-center">
          <span className=" font-bold text-md">{user.allowance}</span>
        </TableCell>
        <TableCell className="font-light text-center">
          <span className="  text-md">{user.contact}</span>
        </TableCell>
        <TableCell className="font-light text-center">
          <span className=" font-bold text-md">{user.address}</span>
        </TableCell>
        <TableCell className="text-center">
          <RoleBadge role={user.position} />
        </TableCell>
        <TableCell className="text-center">
          <Badge variant={statusVariant[user.status] || 'outline'}>
            {user.status}
          </Badge>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <div className="flex items-center p-4">
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search employees ..."
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
              <CardTitle className="text-[#492309]">Users</CardTitle>
              <CardDescription>
                Manage your Users and view their profile.
              </CardDescription>
            </div>
            <div>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Teams</SelectItem>
                  <SelectItem value="north">North Team</SelectItem>
                  <SelectItem value="south">South Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Image</TableHead>
                <TableHead className="text-center">Employee name</TableHead>
                <TableHead className="text-center">Salary</TableHead>
                <TableHead className="text-center">Allowance</TableHead>
                <TableHead className="hidden md:table-cell text-center">
                  Contact
                </TableHead>
                <TableHead className="hidden md:table-cell text-center">
                  Address
                </TableHead>
                <TableHead className="text-center">Position</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableContent()}</TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            <strong>
              {(pagination.currentPage - 1) * pagination.limit + 1}-
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalDocs
              )}
            </strong>{' '}
            of <strong>{pagination.totalDocs}</strong> Users
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default UsersList;
