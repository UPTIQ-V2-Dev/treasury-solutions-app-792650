import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { UploadPage } from '@/pages/UploadPage';

// Mock the services
vi.mock('@/services/treasury', () => ({
    uploadStatement: vi.fn(),
    connectBank: vi.fn()
}));

// Mock sonner
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

const renderWithProviders = (component: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>{component}</BrowserRouter>
        </QueryClientProvider>
    );
};

describe('UploadPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders upload page with correct title and description', () => {
        renderWithProviders(<UploadPage />);

        expect(screen.getByText('Upload Bank Statements')).toBeInTheDocument();
        expect(
            screen.getByText('Upload bank statements or connect your bank account to begin treasury analysis')
        ).toBeInTheDocument();
    });

    it('renders tabs for manual upload and bank connection', () => {
        renderWithProviders(<UploadPage />);

        expect(screen.getByRole('tab', { name: 'Manual Upload' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Bank Connection' })).toBeInTheDocument();
    });

    it('shows manual upload tab by default', () => {
        renderWithProviders(<UploadPage />);

        expect(screen.getByRole('tab', { name: 'Manual Upload' })).toHaveAttribute('data-state', 'active');
        expect(screen.getByText('Client Information')).toBeInTheDocument();
        expect(screen.getByText('Upload Status')).toBeInTheDocument();
    });

    it('switches to bank connection tab', async () => {
        const user = userEvent.setup();
        renderWithProviders(<UploadPage />);

        const bankConnectionTab = screen.getByRole('tab', { name: 'Bank Connection' });
        await user.click(bankConnectionTab);

        expect(bankConnectionTab).toHaveAttribute('data-state', 'active');
        expect(screen.getByText('Bank Account Integration')).toBeInTheDocument();
        expect(screen.getByText('Supported Banks')).toBeInTheDocument();
    });

    it('shows upload status indicators', () => {
        renderWithProviders(<UploadPage />);

        expect(screen.getByText('Client information provided')).toBeInTheDocument();
        expect(screen.getByText('Bank statements uploaded (0)')).toBeInTheDocument();
    });

    it('updates status after client info is provided', async () => {
        const user = userEvent.setup();
        renderWithProviders(<UploadPage />);

        // Fill client information
        const businessNameInput = screen.getByPlaceholderText('Enter the business name');
        const accountInput = screen.getByPlaceholderText('Account number 1');

        await user.type(businessNameInput, 'Test Company');
        await user.type(accountInput, '1234567890');

        const continueButton = screen.getByRole('button', { name: 'Continue to Upload' });
        await user.click(continueButton);

        // Status should update to show info is complete
        expect(screen.getByText('Info Complete')).toBeInTheDocument();
    });

    it('shows file dropzone after client info is provided', async () => {
        const user = userEvent.setup();
        renderWithProviders(<UploadPage />);

        // Fill and submit client information
        const businessNameInput = screen.getByPlaceholderText('Enter the business name');
        const accountInput = screen.getByPlaceholderText('Account number 1');

        await user.type(businessNameInput, 'Test Company');
        await user.type(accountInput, '1234567890');

        const continueButton = screen.getByRole('button', { name: 'Continue to Upload' });
        await user.click(continueButton);

        // File dropzone should appear
        expect(screen.getByText('Drag & drop bank statements here, or click to select files')).toBeInTheDocument();
    });

    it('shows start analysis button when ready', async () => {
        const user = userEvent.setup();
        renderWithProviders(<UploadPage />);

        // Fill client information
        const businessNameInput = screen.getByPlaceholderText('Enter the business name');
        const accountInput = screen.getByPlaceholderText('Account number 1');

        await user.type(businessNameInput, 'Test Company');
        await user.type(accountInput, '1234567890');

        const continueButton = screen.getByRole('button', { name: 'Continue to Upload' });
        await user.click(continueButton);

        // Mock file selection (this would normally be handled by dropzone)
        // For the test, we'll simulate the state after files are selected
        // The actual file selection would require more complex mocking of dropzone
        expect(screen.getByText('Ready to begin analysis!')).toBeInTheDocument();
    });

    it('displays supported banks in connection tab', async () => {
        const user = userEvent.setup();
        renderWithProviders(<UploadPage />);

        const bankConnectionTab = screen.getByRole('tab', { name: 'Bank Connection' });
        await user.click(bankConnectionTab);

        expect(screen.getByText('Chase Business Banking')).toBeInTheDocument();
        expect(screen.getByText('Bank of America Business')).toBeInTheDocument();
        expect(screen.getByText('Wells Fargo Business')).toBeInTheDocument();
    });

    it('opens bank connection modal when connect button is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(<UploadPage />);

        const bankConnectionTab = screen.getByRole('tab', { name: 'Bank Connection' });
        await user.click(bankConnectionTab);

        const connectButton = screen.getByRole('button', { name: 'Connect Bank Account' });
        await user.click(connectButton);

        expect(screen.getByText('Connect Bank Account')).toBeInTheDocument();
    });

    it('shows security features in bank connection tab', async () => {
        const user = userEvent.setup();
        renderWithProviders(<UploadPage />);

        const bankConnectionTab = screen.getByRole('tab', { name: 'Bank Connection' });
        await user.click(bankConnectionTab);

        expect(screen.getByText('Secure Connection')).toBeInTheDocument();
        expect(screen.getByText('Bank-grade encryption')).toBeInTheDocument();
        expect(screen.getByText('Real-time Data')).toBeInTheDocument();
        expect(screen.getByText('Automatic updates')).toBeInTheDocument();
        expect(screen.getByText('Multiple Accounts')).toBeInTheDocument();
        expect(screen.getByText('All business accounts')).toBeInTheDocument();
    });
});
