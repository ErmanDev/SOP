/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import UserForm from './deduction-form';

const userSchema = z.object({
  description: z
    .string()
    .min(2, {
      message: 'First Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'First Name must not be longer than 30 characters.',
    }),
  last_name: z
    .string()
    .min(2, {
      message: 'Last Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Last Name must not be longer than 30 characters.',
    }),

  middle_name: z.string().optional(),
});

const defaultValues = {
  description: '',
  last_name: '',
  middle_name: '',
};

export type UserFormValues = z.infer<typeof userSchema>;

const DeductionContentForm = () => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    mode: 'onTouched',
    defaultValues: defaultValues,
  });

  // const { isAddingDeduction, createDeduction } = useAddUser();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const resetForm = () => {
    form.reset(defaultValues);
  };

  const onSubmit: SubmitHandler<UserFormValues | any> = async (
    data: UserFormValues
  ) => {
    try {
      const { description, last_name, middle_name } = data;
      const userData = {
        description,
        last_name,
        middle_name,
      };

      console.log(userData);
      // await createDeduction(userData);

      resetForm();
      setIsOpen(false);

      console.log(form.getValues());
    } catch (err) {
      console.error(`[SubmittingError]: ${err}`);
    }
  };

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button
          className="h-8 gap-1 "
          size="sm"
          variant="default"
          onClick={() => setIsOpen(true)}
        >
          <PlusCircleIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Deductions
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className=" p-0 flex flex-col h-full md:max-w-[40rem]">
        <header
          className={`py-4 bg-overlay-bg
              border-b border-overlay-border px-6 bg-overlay-bg border-overlay-border flex-shrink-0`}
        >
          <div>
            <h3 className="text-lg font-medium">Addin User</h3>
            <p className="text-xs text-muted-foreground">
              Fill in the details.
            </p>
          </div>
        </header>
        <div className="flex-grow overflow-y-auto">
          <UserForm form={form} />
        </div>
        <SheetFooter className="flex-shrink-0 px-6 py-4 bg-overlay-bg border-t border-overlay-border">
          <Button
            type="submit"
            // disabled={isAddingDeduction}
            onClick={form.handleSubmit(onSubmit)}
          >
            {/* {isAddingDeduction ? 'Creating Deduction...' : 'Create Deduction'} */}
            {/* Add User */}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default DeductionContentForm;
