import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export const clientInfoSchema = z.object({
    name: z.string().min(1, 'Client name is required'),
    accountNumbers: z
        .array(z.string().min(1, 'Account number cannot be empty'))
        .min(1, 'At least one account number is required')
});

export type ClientInfoFormData = z.infer<typeof clientInfoSchema>;

interface ClientInfoFormProps {
    onSubmit: (data: ClientInfoFormData) => void;
    initialData?: Partial<ClientInfoFormData>;
    isSubmitting?: boolean;
}

export const ClientInfoForm = ({ onSubmit, initialData, isSubmitting = false }: ClientInfoFormProps) => {
    const [accountNumbers, setAccountNumbers] = useState<string[]>(initialData?.accountNumbers || ['']);

    const form = useForm<Pick<ClientInfoFormData, 'name'>>({
        resolver: zodResolver(z.object({ name: z.string().min(1, 'Client name is required') })),
        defaultValues: {
            name: initialData?.name || ''
        }
    });

    const handleAddAccount = () => {
        setAccountNumbers([...accountNumbers, '']);
    };

    const handleRemoveAccount = (index: number) => {
        if (accountNumbers.length > 1) {
            setAccountNumbers(accountNumbers.filter((_, i) => i !== index));
        }
    };

    const handleAccountChange = (index: number, value: string) => {
        const newAccountNumbers = [...accountNumbers];
        newAccountNumbers[index] = value;
        setAccountNumbers(newAccountNumbers);
    };

    const handleFormSubmit = (data: Pick<ClientInfoFormData, 'name'>) => {
        const formData: ClientInfoFormData = {
            name: data.name,
            accountNumbers: accountNumbers.filter(account => account.trim() !== '')
        };

        if (formData.accountNumbers.length === 0) {
            return;
        }

        onSubmit(formData);
    };

    const isValid = form.formState.isValid && accountNumbers.some(account => account.trim() !== '');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter the business name'
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                                <FormLabel>Account Numbers</FormLabel>
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleAddAccount}
                                    disabled={isSubmitting}
                                >
                                    <Plus className='h-4 w-4 mr-2' />
                                    Add Account
                                </Button>
                            </div>

                            {accountNumbers.map((account, index) => (
                                <div
                                    key={index}
                                    className='flex items-center gap-2'
                                >
                                    <Input
                                        placeholder={`Account number ${index + 1}`}
                                        value={account}
                                        onChange={e => handleAccountChange(index, e.target.value)}
                                        disabled={isSubmitting}
                                        className='flex-1'
                                    />
                                    {accountNumbers.length > 1 && (
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='icon'
                                            onClick={() => handleRemoveAccount(index)}
                                            disabled={isSubmitting}
                                        >
                                            <X className='h-4 w-4' />
                                        </Button>
                                    )}
                                </div>
                            ))}

                            {accountNumbers.length === 0 && (
                                <div className='text-sm text-red-500'>At least one account number is required</div>
                            )}
                        </div>

                        <Button
                            type='submit'
                            className='w-full'
                            disabled={isSubmitting || !isValid}
                        >
                            {isSubmitting ? 'Processing...' : 'Continue to Upload'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
