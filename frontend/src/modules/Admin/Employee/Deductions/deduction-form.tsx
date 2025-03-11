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

// Component initialization

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DeductionForm = ({ form }: any) => {
  // const {  formState } = form;
  // const { errors } = formState;

  return (
    <div className="p-5">
      <Form {...form}>
        <form className="space-y-8">
          <FormField
            control={form.control}
            name="Description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Pag-ibig" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <Separator /> */}

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
            name="Amount"
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
        </form>
      </Form>
    </div>
  );
};

export default DeductionForm;
