import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { ConnectBankRequest } from '@/types/treasury';

const bankConnectionSchema = z.object({
    bankName: z.string().min(1, 'Bank name is required'),
    accountNumber: z.string().min(1, 'Account number is required'),
    username: z.string().optional(),
    accountId: z.string().optional(),
    apiKey: z.string().optional()
});

type BankConnectionFormData = z.infer<typeof bankConnectionSchema>;

interface BankConnectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (data: ConnectBankRequest) => Promise<void>;
    isConnecting?: boolean;
}

const supportedBanks = [
    { value: 'chase', label: 'Chase Business Banking' },
    { value: 'bofa', label: 'Bank of America Business' },
    { value: 'wells-fargo', label: 'Wells Fargo Business' },
    { value: 'citi', label: 'Citi Business Banking' },
    { value: 'pnc', label: 'PNC Business Banking' },
    { value: 'other', label: 'Other Bank' }
];

export const BankConnectionModal = ({ isOpen, onClose, onConnect, isConnecting = false }: BankConnectionModalProps) => {
    const [error, setError] = useState<string | null>(null);

    const form = useForm<BankConnectionFormData>({
        resolver: zodResolver(bankConnectionSchema),
        defaultValues: {
            bankName: '',
            accountNumber: '',
            username: '',
            accountId: '',
            apiKey: ''
        }
    });

    const handleSubmit = async (data: BankConnectionFormData) => {
        try {
            setError(null);

            const connectData: ConnectBankRequest = {
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                credentials: {
                    ...(data.username && { username: data.username }),
                    ...(data.accountId && { accountId: data.accountId }),
                    ...(data.apiKey && { apiKey: data.apiKey })
                }
            };

            await onConnect(connectData);
            form.reset();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect bank');
        }
    };

    const handleClose = () => {
        if (!isConnecting) {
            form.reset();
            setError(null);
            onClose();
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={handleClose}
        >
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Connect Bank Account</DialogTitle>
                    <DialogDescription>
                        Connect your business bank account to automatically import transaction data. Your credentials
                        are securely encrypted and never stored permanently.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='bankName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Name</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select your bank' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {supportedBanks.map(bank => (
                                                <SelectItem
                                                    key={bank.value}
                                                    value={bank.value}
                                                >
                                                    {bank.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='accountNumber'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter your business account number'
                                            {...field}
                                            disabled={isConnecting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Online Banking Username (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Your online banking username'
                                            {...field}
                                            disabled={isConnecting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='accountId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account ID (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Specific account identifier'
                                            {...field}
                                            disabled={isConnecting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='apiKey'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>API Key (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Bank API key if available'
                                            {...field}
                                            disabled={isConnecting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && (
                            <Alert variant='destructive'>
                                <AlertCircle className='h-4 w-4' />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <DialogFooter className='gap-2'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleClose}
                                disabled={isConnecting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                disabled={isConnecting}
                            >
                                {isConnecting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                {isConnecting ? 'Connecting...' : 'Connect Bank'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
