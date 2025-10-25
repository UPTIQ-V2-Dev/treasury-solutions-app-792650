import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientInfoForm } from '@/components/upload/ClientInfoForm';

describe('ClientInfoForm', () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form fields correctly', () => {
        render(<ClientInfoForm onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText('Business Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Account Numbers')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter the business name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Account number 1')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue to Upload' })).toBeInTheDocument();
    });

    it('allows adding additional account numbers', async () => {
        const user = userEvent.setup();
        render(<ClientInfoForm onSubmit={mockOnSubmit} />);

        const addButton = screen.getByRole('button', { name: 'Add Account' });
        await user.click(addButton);

        expect(screen.getByPlaceholderText('Account number 2')).toBeInTheDocument();
    });

    it('allows removing account numbers when multiple exist', async () => {
        const user = userEvent.setup();
        render(<ClientInfoForm onSubmit={mockOnSubmit} />);

        // Add a second account
        const addButton = screen.getByRole('button', { name: 'Add Account' });
        await user.click(addButton);

        // Now remove buttons should be visible
        const removeButtons = screen.getAllByRole('button', { name: '' });
        expect(removeButtons).toHaveLength(2); // One for each account field

        await user.click(removeButtons[1]);
        expect(screen.queryByPlaceholderText('Account number 2')).not.toBeInTheDocument();
    });

    it('does not show remove button when only one account exists', () => {
        render(<ClientInfoForm onSubmit={mockOnSubmit} />);

        // Should not have any remove buttons with only one account
        const removeButtons = screen.queryAllByRole('button', { name: '' });
        expect(removeButtons).toHaveLength(0);
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        render(<ClientInfoForm onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByRole('button', { name: 'Continue to Upload' });
        await user.click(submitButton);

        expect(screen.getByText('Client name is required')).toBeInTheDocument();
    });

    it('validates empty account numbers', async () => {
        const user = userEvent.setup();
        render(<ClientInfoForm onSubmit={mockOnSubmit} />);

        const businessNameInput = screen.getByPlaceholderText('Enter the business name');
        await user.type(businessNameInput, 'Test Business');

        const submitButton = screen.getByRole('button', { name: 'Continue to Upload' });
        await user.click(submitButton);

        expect(screen.getByText('Account number cannot be empty')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
        const user = userEvent.setup();
        render(<ClientInfoForm onSubmit={mockOnSubmit} />);

        const businessNameInput = screen.getByPlaceholderText('Enter the business name');
        const accountInput = screen.getByPlaceholderText('Account number 1');

        await user.type(businessNameInput, 'Acme Corp');
        await user.type(accountInput, '1234567890');

        const submitButton = screen.getByRole('button', { name: 'Continue to Upload' });
        await user.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledWith({
            name: 'Acme Corp',
            accountNumbers: ['1234567890']
        });
    });

    it('submits form with multiple account numbers', async () => {
        const user = userEvent.setup();
        render(<ClientInfoForm onSubmit={mockOnSubmit} />);

        const businessNameInput = screen.getByPlaceholderText('Enter the business name');
        await user.type(businessNameInput, 'Acme Corp');

        // Fill first account
        const firstAccountInput = screen.getByPlaceholderText('Account number 1');
        await user.type(firstAccountInput, '1234567890');

        // Add second account
        const addButton = screen.getByRole('button', { name: 'Add Account' });
        await user.click(addButton);

        const secondAccountInput = screen.getByPlaceholderText('Account number 2');
        await user.type(secondAccountInput, '0987654321');

        const submitButton = screen.getByRole('button', { name: 'Continue to Upload' });
        await user.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledWith({
            name: 'Acme Corp',
            accountNumbers: ['1234567890', '0987654321']
        });
    });

    it('pre-populates form with initial data', () => {
        const initialData = {
            name: 'Test Company',
            accountNumbers: ['1111111111', '2222222222']
        };

        render(
            <ClientInfoForm
                onSubmit={mockOnSubmit}
                initialData={initialData}
            />
        );

        expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1111111111')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2222222222')).toBeInTheDocument();
    });

    it('disables form when submitting', () => {
        render(
            <ClientInfoForm
                onSubmit={mockOnSubmit}
                isSubmitting={true}
            />
        );

        const businessNameInput = screen.getByPlaceholderText('Enter the business name');
        const accountInput = screen.getByPlaceholderText('Account number 1');
        const submitButton = screen.getByRole('button', { name: 'Processing...' });
        const addButton = screen.getByRole('button', { name: 'Add Account' });

        expect(businessNameInput).toBeDisabled();
        expect(accountInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
        expect(addButton).toBeDisabled();
    });
});
