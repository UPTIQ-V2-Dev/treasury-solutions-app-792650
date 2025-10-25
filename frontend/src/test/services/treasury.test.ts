import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadStatement, connectBank, getAnalysisMetrics, getRecommendations } from '@/services/treasury';
import { apiClient } from '@/lib/api';

// Mock the API client
vi.mock('@/lib/api', () => ({
    apiClient: {
        post: vi.fn(),
        get: vi.fn(),
        delete: vi.fn()
    }
}));

// Mock environment variable
vi.mock('import.meta.env', () => ({
    VITE_USE_MOCK_DATA: 'false'
}));

describe('Treasury Services', () => {
    const mockApiClient = apiClient as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('uploadStatement', () => {
        it('uploads files and client info successfully', async () => {
            const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
            const mockResponse = {
                data: {
                    clientId: '1',
                    uploadId: 'upload123',
                    files: [],
                    status: 'processing'
                }
            };

            mockApiClient.post.mockResolvedValue(mockResponse);

            const result = await uploadStatement({
                files: [mockFile],
                clientInfo: {
                    name: 'Test Company',
                    accountNumbers: ['1234567890']
                }
            });

            expect(mockApiClient.post).toHaveBeenCalledWith('/api/statements/upload', expect.any(FormData), {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            expect(result).toEqual(mockResponse.data);
        });

        it('returns mock data when VITE_USE_MOCK_DATA is true', async () => {
            // Temporarily mock the environment variable
            vi.doMock('import.meta', () => ({
                env: {
                    VITE_USE_MOCK_DATA: 'true'
                }
            }));

            const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

            const result = await uploadStatement({
                files: [mockFile],
                clientInfo: {
                    name: 'Test Company',
                    accountNumbers: ['1234567890']
                }
            });

            expect(result).toMatchObject({
                clientId: '1',
                status: 'processing'
            });
            expect(mockApiClient.post).not.toHaveBeenCalled();
        });
    });

    describe('connectBank', () => {
        it('connects bank successfully', async () => {
            const mockResponse = {
                data: {
                    connectionId: 'conn123',
                    status: 'connected',
                    message: 'Success'
                }
            };

            mockApiClient.post.mockResolvedValue(mockResponse);

            const result = await connectBank({
                bankName: 'Chase',
                accountNumber: '1234567890',
                credentials: { username: 'testuser' }
            });

            expect(mockApiClient.post).toHaveBeenCalledWith('/api/banks/connect', {
                bankName: 'Chase',
                accountNumber: '1234567890',
                credentials: { username: 'testuser' }
            });
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('getAnalysisMetrics', () => {
        it('fetches analysis metrics for a client', async () => {
            const mockMetrics = {
                clientId: '1',
                averageDailyBalance: 250000,
                totalInflows: 1000000,
                totalOutflows: 800000,
                idleCashAmount: 150000,
                liquidityRatio: 1.25,
                cashFlowVolatility: 0.15,
                seasonalTrends: [],
                paymentConcentration: []
            };

            mockApiClient.get.mockResolvedValue({ data: mockMetrics });

            const result = await getAnalysisMetrics('1');

            expect(mockApiClient.get).toHaveBeenCalledWith('/api/analysis/1/metrics');
            expect(result).toEqual(mockMetrics);
        });
    });

    describe('getRecommendations', () => {
        it('fetches recommendations for a client', async () => {
            const mockRecommendations = [
                {
                    id: '1',
                    clientId: '1',
                    productId: '1',
                    productName: 'Sweep Account',
                    rationale: 'High idle balances',
                    dataSource: 'Balance analysis',
                    estimatedBenefit: 5000,
                    benefitType: 'yield_improvement' as const,
                    priority: 'high' as const,
                    status: 'pending' as const,
                    createdAt: '2024-01-01T00:00:00Z'
                }
            ];

            mockApiClient.get.mockResolvedValue({ data: mockRecommendations });

            const result = await getRecommendations('1');

            expect(mockApiClient.get).toHaveBeenCalledWith('/api/recommendations/1');
            expect(result).toEqual(mockRecommendations);
        });
    });

    describe('error handling', () => {
        it('handles API errors properly', async () => {
            const errorMessage = 'Network error';
            mockApiClient.get.mockRejectedValue(new Error(errorMessage));

            await expect(getAnalysisMetrics('1')).rejects.toThrow(errorMessage);
        });
    });
});
