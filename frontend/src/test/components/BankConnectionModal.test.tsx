import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BankConnectionModal } from '@/components/upload/BankConnectionModal';

describe('BankConnectionModal', () => {
    const mockOnClose = vi.fn();
    const mockOnConnect = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders modal when open', () => {
        render(
            <BankConnectionModal
                isOpen={true}
                onClose={mockOnClose}
                onConnect={mockOnConnect}
            />
        );

        expect(screen.getByText('Connect Bank Account')).toBeInTheDocument();
        expect(
            screen.getByText('Connect your business bank account to automatically import transaction data.')
        ).toBeInTheDocument();
    });

    it('does not render modal when closed', () => {
        render(
            <BankConnectionModal
                isOpen={false}
                onClose={mockOnClose}
                onConnect={mockOnConnect}
            />
        );

        expect(screen.queryByText('Connect Bank Account')).not.toBeInTheDocument();
    });

    it('renders all form fields', () => {
        render(
            <BankConnectionModal
                isOpen={true}
                onClose={mockOnClose}
                onConnect={mockOnConnect}
            />
        );

        expect(screen.getByLabelText('Bank Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Account Number')).toBeInTheDocument();
        expect(screen.getByLabelText('Online Banking Username (Optional)')).toBeInTheDocument();
        expect(screen.getByLabelText('Account ID (Optional)')).toBeInTheDocument();
        expect(screen.getByLabelText('API Key (Optional)')).toBeInTheDocument();
    });

    it('shows bank selection options', async () => {
        const user = userEvent.setup();
        render(
            <BankConnectionModal
                isOpen={true}
                onClose={mockOnClose}
                onConnect={mockOnConnect}
            />
        );

        const bankSelect = screen.getByRole('combobox');
        await user.click(bankSelect);

        expect(screen.getByText('Chase Business Banking')).toBeInTheDocument();
        expect(screen.getByText('Bank of America Business')).toBeInTheDocument();
        expect(screen.getByText('Wells Fargo Business')).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        render(
            <BankConnectionModal
                isOpen={true}
                onClose={mockOnClose}
                onConnect={mockOnConnect}
            />
        );

        const connectButton = screen.getByRole('button', { name: 'Connect Bank' });
        await user.click(connectButton);

        expect(screen.getByText('Bank name is required')).toBeInTheDocument();
        expect(screen.getByText('Account number is required')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
        const user = userEvent.setup();
        render(
            <BankConnectionModal
                isOpen={true}
                onClose={mockOnClose}
                onConnect={mockOnConnect}
            />
        );

        // Select bank
        const bankSelect = screen.getByRole('combobox');
        await user.click(bankSelect);
        await user.click(screen.getByText('Chase Business Banking'));

        // Fill required fields
        const accountInput = screen.getByPlaceholderText('Enter your business account number');
        await user.type(accountInput, '1234567890');

        // Fill optional fields
        const usernameInput = screen.getByPlaceholderText('Your online banking username');
        await user.type(usernameInput, 'testuser');

        const connectButton = screen.getByRole('button', { name: 'Connect Bank' });
        await user.click(connectButton);

        expect(mockOnConnect).toHaveBeenCalledWith({
            bankName: 'chase',
            accountNumber: '1234567890',
            credentials: {
                username: 'testuser'
            }
        });
    });

    it('handles connection errors', async () => {
        const user = userEvent.setup();
        const mockOnConnectError = vi.fn().mockRejectedValue(new Error('Connection failed'));

        render(
            <BankConnectionModal
                isOpen={true}
                onClose={mockOnClose}
                onConnect={mockOnConnectError}
            />
        );

        // Fill and submit form
        const bankSelect = screen.getByRole('combobox');
        await user.click(bankSelect);
        await user.click(screen.getByText('Chase Business Banking'));

        const accountInput = screen.getByPlaceholderText('Enter your business account number');
        await user.type(accountInput, '1234567890');

        const connectButton = screen.getByRole('button', { name: 'Connect Bank' });
        await user.click(connectButton);

        // Wait for error to appear
        expect(await screen.findByText('Connection failed')).toBeInTheDocument();
    });

    it('disables form when connecting', () => {
        render(
            <BankConnectionModal
                isOpen={true}
                onClose={mockOnClose}
                onConnect={mockOnConnect}
                isConnecting={true}
            />
        );

        const accountInput = screen.getByPlaceholderText('Enter your business account number');
        const usernameInput = screen.getByPlaceholderText('Your online banking username');
        const connectButton = screen.getByRole('button', { name: 'Connecting...' });

        expect(accountInput).toBeDisabled();
        expect(usernameInput).toBeDisabled();
        expect(connectButton).toBeDisabled();
    });

    it('calls onClose when cancel button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <BankConnectionModal
                isOpen={true}
                onClose={mockOnClose}
                onConnect={mockOnConnect}
            />
        );

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await user.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not allow closing when connecting', () => {
        render(
            <BankConnectionModal
                isOpen={true}
                onClose={mockOnClose}
                onConnect={mockOnConnect}
                isConnecting={true}
            />
        );

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        expect(cancelButton).toBeDisabled();
    });
});
