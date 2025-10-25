import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileWithPreview extends File {
    id: string;
    progress?: number;
    status?: 'uploading' | 'completed' | 'error';
    errorMessage?: string;
}

interface FileDropzoneProps {
    onFilesSelected: (files: File[]) => void;
    onFileRemove: (fileId: string) => void;
    files: FileWithPreview[];
    isUploading?: boolean;
    maxFiles?: number;
    maxSize?: number; // in bytes
}

export const FileDropzone = ({
    onFilesSelected,
    onFileRemove,
    files,
    isUploading = false,
    maxFiles = 5,
    maxSize = 10 * 1024 * 1024 // 10MB
}: FileDropzoneProps) => {
    const [errors, setErrors] = useState<string[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            setErrors([]);

            if (rejectedFiles.length > 0) {
                const errorMessages = rejectedFiles.map(rejection => {
                    const error = rejection.errors[0];
                    switch (error?.code) {
                        case 'file-too-large':
                            return `${rejection.file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`;
                        case 'file-invalid-type':
                            return `${rejection.file.name} is not a supported file type.`;
                        case 'too-many-files':
                            return `Too many files selected. Maximum is ${maxFiles} files.`;
                        default:
                            return `${rejection.file.name}: ${error?.message || 'Upload failed'}`;
                    }
                });
                setErrors(errorMessages);
                return;
            }

            if (files.length + acceptedFiles.length > maxFiles) {
                setErrors([`Cannot upload more than ${maxFiles} files at once.`]);
                return;
            }

            onFilesSelected(acceptedFiles);
        },
        [files.length, maxFiles, maxSize, onFilesSelected]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxSize,
        maxFiles: maxFiles - files.length,
        disabled: isUploading
    });

    const formatFileSize = (size: number) => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className='h-4 w-4 text-green-500' />;
            case 'error':
                return <AlertCircle className='h-4 w-4 text-red-500' />;
            default:
                return <File className='h-4 w-4 text-muted-foreground' />;
        }
    };

    return (
        <div className='space-y-4'>
            <Card>
                <CardContent className='p-6'>
                    <div
                        {...getRootProps()}
                        className={cn(
                            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
                            isUploading && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        <input {...getInputProps()} />
                        <Upload className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
                        {isDragActive ? (
                            <p className='text-lg font-medium'>Drop files here...</p>
                        ) : (
                            <div className='space-y-2'>
                                <p className='text-lg font-medium'>
                                    Drag & drop bank statements here, or click to select files
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                    Supports PDF, CSV, XLS, and XLSX files up to {maxSize / (1024 * 1024)}MB each
                                </p>
                                <Button
                                    type='button'
                                    variant='outline'
                                    disabled={isUploading}
                                >
                                    Select Files
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {errors.length > 0 && (
                <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>
                        <ul className='list-disc list-inside space-y-1'>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {files.length > 0 && (
                <Card>
                    <CardContent className='p-4'>
                        <h3 className='font-medium mb-4'>Selected Files ({files.length})</h3>
                        <div className='space-y-3'>
                            {files.map(file => (
                                <div
                                    key={file.id}
                                    className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'
                                >
                                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                                        {getStatusIcon(file.status)}
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm font-medium truncate'>{file.name}</p>
                                            <p className='text-xs text-muted-foreground'>
                                                {formatFileSize(file.size)}
                                                {file.status === 'error' && file.errorMessage && (
                                                    <span className='text-red-500 ml-2'>{file.errorMessage}</span>
                                                )}
                                            </p>
                                            {file.status === 'uploading' && typeof file.progress === 'number' && (
                                                <Progress
                                                    value={file.progress}
                                                    className='mt-2 h-2'
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {!isUploading && file.status !== 'uploading' && (
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='icon'
                                            onClick={() => onFileRemove(file.id)}
                                            className='shrink-0'
                                        >
                                            <X className='h-4 w-4' />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
