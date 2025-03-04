import { Button } from '@/components/ui/button';
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
import { MoreHorizontalIcon, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  [key in 'admin' | 'staff' | 'visitor']: string;
};

const roleColors: RoleColor = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  staff: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  visitor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
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
  const navigate = useNavigate();
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data: usersData, isLoading, error } = useReadUsers();
  const Teams = [
    {
      id: 1,
      name: 'North Team',
      address: '123 Health St',
      phone: '555-0101',
      hours: '8AM - 10PM',
    },
    {
      id: 2,
      name: 'South Team',
      address: '456 Wellness Ave',
      phone: '555-0202',
      hours: '24/7',
    },
  ];

  const memoUsers = useMemo(() => {
    return usersData?.data?.users || [];
  }, [usersData]);

  const pagination = useMemo(
    () => ({
      currentPage: usersData?.data?.currentPage?.page || 1,
      totalPages: usersData?.data?.totalPages || 1,
      totalDocs: usersData?.data?.totalDocs || 0,
      limit: usersData?.data?.currentPage?.limit || 20,
    }),
    [usersData]
  );

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center">
            <Spinner className="mx-auto" />
            <span className="sr-only">Loading users...</span>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-[400px] text-center text-red-500">
            Error loading users. Please try again later.
          </TableCell>
        </TableRow>
      );
    }

    if (!memoUsers || memoUsers.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-[400px]  text-center">
            No users found.
          </TableCell>
        </TableRow>
      );
    }

    return memoUsers.map((user: IUser) => (
      <TableRow key={user.id}>
        <TableCell className="hidden sm:table-cell">
          <img
            alt={`${user.first_name}'s avatar`}
            className="aspect-square rounded-md object-cover"
            height="64"
            src={user.profile_url as string}
            width="64"
          />
        </TableCell>
        <TableCell className="font-light">
          <span className="text-md font-bold">
            {user.first_name} {user.last_name}
          </span>{' '}
          <br />
          <span className="text-xs">{user.email}</span>
        </TableCell>
        <TableCell>
          <Badge variant="outline">Active</Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <RoleBadge role={user.userRole || 'admin'} />
        </TableCell>

        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={`Actions for ${user.email}`}
                size="icon"
                variant="ghost"
              >
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigate(`update_form/${user.user_id}`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <Select
                value={selectedPharmacy}
                onValueChange={setSelectedPharmacy}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Teams</SelectItem>
                  {Teams.map((pharmacy) => (
                    <SelectItem key={pharmacy.id} value={pharmacy.name}>
                      {pharmacy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell"></TableHead>{' '}
                <TableHead className="text-center">Image</TableHead>
                <TableHead className="text-center">Employee name</TableHead>
                <TableHead className="text-center">Salary</TableHead>
                <TableHead className="text-center">Allowance</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden md:table-cell">Address</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
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
