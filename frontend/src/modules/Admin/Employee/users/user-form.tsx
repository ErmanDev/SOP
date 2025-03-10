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


import { Label } from '@/components/ui/label';

// Component initialization

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserForm = ({ form }: any) => {
  const { setFocus, setValue, formState } = form;
  const { errors } = formState;



  return (
    <div className="p-5">
      <Form {...form}>
        <form className="space-y-8">
          <FormField
            control={form.control}
            name="first_name"
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
            name="middle_name"
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
            name="last_name"
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
            name="position"
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
                    <SelectItem value="manager">Manager</SelectItem>
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
            control={form.control}
            name="allowance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Allowance <span className="text-red-600">*</span>
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
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Contact <span className="text-red-600">*</span>
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Address <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Cruz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Image</Label>
            <Input id="picture" type="file" />
          </div>

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
        </form>
      </Form>
    </div>
  );
};

export default UserForm;
