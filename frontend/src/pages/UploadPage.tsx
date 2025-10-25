import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileDropzone } from '@/components/upload/FileDropzone';
import { ClientInfoForm, ClientInfoFormData } from '@/components/upload/ClientInfoForm';
import { BankConnectionModal } from '@/components/upload/BankConnectionModal';
import { Upload, Building2, CreditCard, CheckCircle, Plus } from 'lucide-react';
import { uploadStatement, connectBank } from '@/services/treasury';
import { ConnectBankRequest } from '@/types/treasury';
import { toast } from 'sonner';

interface FileWithPreview extends File {
    id: string;
    progress?: number;
    status?: 'uploading' | 'completed' | 'error';
    errorMessage?: string;
}

export const UploadPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'manual' | 'connect'>('manual');
    const [clientInfo, setClientInfo] = useState<ClientInfoFormData | null>(null);
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [showBankModal, setShowBankModal] = useState(false);

    const uploadMutation = useMutation({
        mutationFn: uploadStatement,
        onSuccess: response => {
            toast.success('Files uploaded successfully!');
            navigate('/analysis', {
                state: {
                    clientId: response.clientId,
                    uploadId: response.uploadId
                }
            });
        },
        onError: error => {
            toast.error('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    });

    const connectBankMutation = useMutation({
        mutationFn: connectBank,
        onSuccess: response => {
            toast.success('Bank connected successfully!');
            if (response.status === 'connected') {
                navigate('/analysis', {
                    state: {
                        connectionId: response.connectionId
                    }
                });
            }
            setShowBankModal(false);
        },
        onError: error => {
            toast.error('Connection failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    });

    const handleClientInfoSubmit = (data: ClientInfoFormData) => {
        setClientInfo(data);
    };

    const handleFilesSelected = (newFiles: File[]) => {
        const filesWithPreview: FileWithPreview[] = newFiles.map(file => ({
            ...file,
            id: Math.random().toString(36).substring(7),
            status: 'completed' as const
        }));
        setFiles(prev => [...prev, ...filesWithPreview]);
    };

    const handleFileRemove = (fileId: string) => {
        setFiles(prev => prev.filter(file => file.id !== fileId));
    };

    const handleUpload = () => {
        if (!clientInfo || files.length === 0) return;

        const fileObjects = files.map(f => {
            const file = new File([f], f.name, { type: f.type });
            return file;
        });

        uploadMutation.mutate({
            files: fileObjects,
            clientInfo
        });
    };

    const handleBankConnect = async (data: ConnectBankRequest) => {
        await connectBankMutation.mutateAsync(data);
    };

    const canUpload = clientInfo && files.length > 0 && !uploadMutation.isPending;

    return (
        <div className='max-w-4xl mx-auto space-y-6'>
            <div className='flex items-center gap-3 mb-6'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                    <Upload className='h-6 w-6 text-primary' />
                </div>
                <div>
                    <h1 className='text-2xl font-bold'>Upload Bank Statements</h1>
                    <p className='text-muted-foreground'>
                        Upload bank statements or connect your bank account to begin treasury analysis
                    </p>
                </div>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={value => setActiveTab(value as 'manual' | 'connect')}
            >
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger
                        value='manual'
                        className='flex items-center gap-2'
                    >
                        <Upload className='h-4 w-4' />
                        Manual Upload
                    </TabsTrigger>
                    <TabsTrigger
                        value='connect'
                        className='flex items-center gap-2'
                    >
                        <CreditCard className='h-4 w-4' />
                        Bank Connection
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value='manual'
                    className='space-y-6'
                >
                    <div className='grid gap-6 md:grid-cols-2'>
                        <div className='order-2 md:order-1'>
                            <ClientInfoForm
                                onSubmit={handleClientInfoSubmit}
                                initialData={clientInfo || undefined}
                                isSubmitting={uploadMutation.isPending}
                            />
                        </div>

                        <div className='order-1 md:order-2'>
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-center justify-between'>
                                        Upload Status
                                        {clientInfo && (
                                            <Badge
                                                variant='outline'
                                                className='ml-2'
                                            >
                                                <CheckCircle className='h-3 w-3 mr-1' />
                                                Info Complete
                                            </Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='flex items-center gap-3'>
                                        <div
                                            className={`w-3 h-3 rounded-full ${clientInfo ? 'bg-green-500' : 'bg-gray-300'}`}
                                        />
                                        <span className={clientInfo ? 'text-foreground' : 'text-muted-foreground'}>
                                            Client information provided
                                        </span>
                                    </div>

                                    <div className='flex items-center gap-3'>
                                        <div
                                            className={`w-3 h-3 rounded-full ${files.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}
                                        />
                                        <span
                                            className={files.length > 0 ? 'text-foreground' : 'text-muted-foreground'}
                                        >
                                            Bank statements uploaded ({files.length})
                                        </span>
                                    </div>

                                    {canUpload && (
                                        <Alert>
                                            <CheckCircle className='h-4 w-4' />
                                            <AlertDescription>
                                                Ready to begin analysis! Click "Start Analysis" to process the uploaded
                                                statements.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {clientInfo && (
                        <div className='space-y-4'>
                            <FileDropzone
                                onFilesSelected={handleFilesSelected}
                                onFileRemove={handleFileRemove}
                                files={files}
                                isUploading={uploadMutation.isPending}
                            />

                            {files.length > 0 && (
                                <div className='flex justify-end'>
                                    <Button
                                        onClick={handleUpload}
                                        disabled={!canUpload}
                                        size='lg'
                                        className='min-w-[200px]'
                                    >
                                        {uploadMutation.isPending ? (
                                            <>
                                                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent' />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className='mr-2 h-4 w-4' />
                                                Start Analysis
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent
                    value='connect'
                    className='space-y-6'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Building2 className='h-5 w-5' />
                                Bank Account Integration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <p className='text-muted-foreground'>
                                Connect your business bank account for automatic transaction importing and real-time
                                analysis. Your banking credentials are encrypted and processed securely.
                            </p>

                            <div className='grid gap-4 md:grid-cols-3'>
                                <div className='flex items-center gap-3 p-4 border rounded-lg'>
                                    <CheckCircle className='h-5 w-5 text-green-500' />
                                    <div>
                                        <p className='font-medium'>Secure Connection</p>
                                        <p className='text-sm text-muted-foreground'>Bank-grade encryption</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 p-4 border rounded-lg'>
                                    <CheckCircle className='h-5 w-5 text-green-500' />
                                    <div>
                                        <p className='font-medium'>Real-time Data</p>
                                        <p className='text-sm text-muted-foreground'>Automatic updates</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 p-4 border rounded-lg'>
                                    <CheckCircle className='h-5 w-5 text-green-500' />
                                    <div>
                                        <p className='font-medium'>Multiple Accounts</p>
                                        <p className='text-sm text-muted-foreground'>All business accounts</p>
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-center'>
                                <Button
                                    onClick={() => setShowBankModal(true)}
                                    size='lg'
                                    className='min-w-[200px]'
                                >
                                    <Plus className='mr-2 h-4 w-4' />
                                    Connect Bank Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Supported Banks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                {[
                                    'Chase Business Banking',
                                    'Bank of America Business',
                                    'Wells Fargo Business',
                                    'Citi Business Banking',
                                    'PNC Business Banking',
                                    'US Bank Business',
                                    'TD Bank Business',
                                    'Capital One Business'
                                ].map(bank => (
                                    <div
                                        key={bank}
                                        className='p-3 border rounded-lg text-center'
                                    >
                                        <p className='text-sm font-medium'>{bank}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <BankConnectionModal
                isOpen={showBankModal}
                onClose={() => setShowBankModal(false)}
                onConnect={handleBankConnect}
                isConnecting={connectBankMutation.isPending}
            />
        </div>
    );
};
