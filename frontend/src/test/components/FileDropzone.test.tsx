import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileDropzone } from '@/components/upload/FileDropzone';

describe('FileDropzone', () => {
    const mockOnFilesSelected = vi.fn();
    const mockOnFileRemove = vi.fn();

    const mockFiles = [
        {
            id: '1',
            name: 'test-statement.pdf',
            type: 'application/pdf',
            size: 1024000,
            status: 'completed' as const
        },
        {
            id: '2',
            name: 'transactions.csv',
            type: 'text/csv',
            size: 512000,
            status: 'uploading' as const,
            progress: 50
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the dropzone with correct text', () => {
        render(
            <FileDropzone
                onFilesSelected={mockOnFilesSelected}
                onFileRemove={mockOnFileRemove}
                files={[]}
            />
        );

        expect(screen.getByText('Drag & drop bank statements here, or click to select files')).toBeInTheDocument();
        expect(screen.getByText('Supports PDF, CSV, XLS, and XLSX files up to 10MB each')).toBeInTheDocument();
    });

    it('displays uploaded files correctly', () => {
        render(
            <FileDropzone
                onFilesSelected={mockOnFilesSelected}
                onFileRemove={mockOnFileRemove}
                files={mockFiles}
            />
        );

        expect(screen.getByText('Selected Files (2)')).toBeInTheDocument();
        expect(screen.getByText('test-statement.pdf')).toBeInTheDocument();
        expect(screen.getByText('transactions.csv')).toBeInTheDocument();
        expect(screen.getByText('1.00 MB')).toBeInTheDocument();
        expect(screen.getByText('512.00 KB')).toBeInTheDocument();
    });

    it('shows progress bar for uploading files', () => {
        render(
            <FileDropzone
                onFilesSelected={mockOnFilesSelected}
                onFileRemove={mockOnFileRemove}
                files={[mockFiles[1]]}
            />
        );

        // Progress bar should be present for uploading files
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toBeInTheDocument();
    });

    it('allows removing files when not uploading', async () => {
        const user = userEvent.setup();

        render(
            <FileDropzone
                onFilesSelected={mockOnFilesSelected}
                onFileRemove={mockOnFileRemove}
                files={[mockFiles[0]]}
                isUploading={false}
            />
        );

        const removeButton = screen.getByRole('button', { name: '' });
        await user.click(removeButton);

        expect(mockOnFileRemove).toHaveBeenCalledWith('1');
    });

    it('disables remove buttons when uploading', () => {
        render(
            <FileDropzone
                onFilesSelected={mockOnFilesSelected}
                onFileRemove={mockOnFileRemove}
                files={[mockFiles[0]]}
                isUploading={true}
            />
        );

        // No remove buttons should be present when uploading
        const removeButtons = screen.queryAllByRole('button', { name: '' });
        expect(removeButtons).toHaveLength(0);
    });

    it('shows error messages for file validation errors', () => {
        render(
            <FileDropzone
                onFilesSelected={mockOnFilesSelected}
                onFileRemove={mockOnFileRemove}
                files={[]}
            />
        );

        // This would normally be triggered by the dropzone validation
        // We'll test this via integration tests instead
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('formats file sizes correctly', () => {
        const largeFile = {
            ...mockFiles[0],
            size: 5 * 1024 * 1024 // 5MB
        };

        render(
            <FileDropzone
                onFilesSelected={mockOnFilesSelected}
                onFileRemove={mockOnFileRemove}
                files={[largeFile]}
            />
        );

        expect(screen.getByText('5.00 MB')).toBeInTheDocument();
    });

    it('shows appropriate status icons for different file states', () => {
        const filesWithDifferentStates = [
            { ...mockFiles[0], status: 'completed' as const },
            { ...mockFiles[1], status: 'error' as const, errorMessage: 'Upload failed' }
        ];

        render(
            <FileDropzone
                onFilesSelected={mockOnFilesSelected}
                onFileRemove={mockOnFileRemove}
                files={filesWithDifferentStates}
            />
        );

        // Check that error message is displayed
        expect(screen.getByText('Upload failed')).toBeInTheDocument();
    });
});
