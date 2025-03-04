'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { generatePassword } from '@/shared/generateRandomPassword';
import { useEffect } from 'react';

// Component initialization

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserForm = ({ form }: any) => {
  const { setFocus, setValue, formState } = form;
  const { errors } = formState;

  useEffect(() => {
    // If there are errors, focus on the first field that has an error
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0]; // Get the first error key
      setFocus(firstErrorKey); // Automatically focus on the first error field
    }

    setValue('password', generatePassword());
  }, [errors, setFocus]);

  return (
    <div className="p-5">
      <Form {...form}>
        <form className="space-y-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Juanito" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Dela" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Cruz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <Separator /> */}

          <FormField
            control={form.control}
            name="userRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Position <span className="text-red-600">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a position to user" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">HR</SelectItem>
                    <SelectItem value="cashier">Manager</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Salary <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01" // Allows decimals
                    min="0"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <InputPassword
                    placeholder=""
                    type="password"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm Password <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <InputPassword
                    placeholder=""
                    type="password"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default UserForm;
