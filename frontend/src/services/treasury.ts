import { api as apiClient } from '@/lib/api';
import {
    UploadStatementRequest,
    UploadStatementResponse,
    ConnectBankRequest,
    ConnectBankResponse,
    Client,
    AnalysisMetrics,
    AnalysisStatus,
    Transaction,
    Recommendation,
    TreasuryProduct,
    AcceptRecommendationRequest,
    RejectRecommendationRequest,
    GenerateReportRequest,
    ReportData,
    BankConnection
} from '@/types/treasury';
import {
    mockAnalysisMetrics,
    mockAnalysisStatus,
    mockBankConnections,
    mockClients,
    mockRecommendations,
    mockReportData,
    mockTransactions,
    mockTreasuryProducts,
    mockUploadedFiles
} from '@/data/treasuryMockData';

// Statement and File Upload Services
export const uploadStatement = async (data: UploadStatementRequest): Promise<UploadStatementResponse> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Mock response for file upload
        return {
            clientId: '1',
            uploadId: 'upload_' + Date.now(),
            files: mockUploadedFiles,
            status: 'processing'
        };
    }

    const formData = new FormData();
    data.files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
    });
    formData.append('clientInfo', JSON.stringify(data.clientInfo));

    const response = await apiClient.post<UploadStatementResponse>('/api/statements/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getUploadStatus = async (uploadId: string): Promise<AnalysisStatus> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return mockAnalysisStatus;
    }

    const response = await apiClient.get<AnalysisStatus>(`/api/statements/upload/${uploadId}/status`);
    return response.data;
};

// Bank Connection Services
export const getBankConnections = async (): Promise<BankConnection[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return mockBankConnections;
    }

    const response = await apiClient.get<BankConnection[]>('/api/banks/connections');
    return response.data;
};

export const connectBank = async (data: ConnectBankRequest): Promise<ConnectBankResponse> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return {
            connectionId: 'conn_' + Date.now(),
            status: 'connected',
            message: 'Bank connection established successfully'
        };
    }

    const response = await apiClient.post<ConnectBankResponse>('/api/banks/connect', data);
    return response.data;
};

export const disconnectBank = async (connectionId: string): Promise<{ success: boolean }> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return { success: true };
    }

    const response = await apiClient.delete<{ success: boolean }>(`/api/banks/connections/${connectionId}`);
    return response.data;
};

// Client Services
export const getClients = async (): Promise<Client[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return mockClients;
    }

    const response = await apiClient.get<Client[]>('/api/clients');
    return response.data;
};

export const getClient = async (clientId: string): Promise<Client> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const client = mockClients.find(c => c.id === clientId);
        if (!client) throw new Error('Client not found');
        return client;
    }

    const response = await apiClient.get<Client>(`/api/clients/${clientId}`);
    return response.data;
};

// Analysis Services
export const getAnalysisMetrics = async (clientId: string): Promise<AnalysisMetrics> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return { ...mockAnalysisMetrics, clientId };
    }

    const response = await apiClient.get<AnalysisMetrics>(`/api/analysis/${clientId}/metrics`);
    return response.data;
};

export const getAnalysisStatus = async (clientId: string): Promise<AnalysisStatus> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return { ...mockAnalysisStatus, clientId };
    }

    const response = await apiClient.get<AnalysisStatus>(`/api/analysis/${clientId}/status`);
    return response.data;
};

// Transaction Services
export const getTransactions = async (
    clientId: string,
    params?: {
        startDate?: string;
        endDate?: string;
        category?: string;
        type?: string;
        limit?: number;
        offset?: number;
    }
): Promise<Transaction[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return mockTransactions;
    }

    const response = await apiClient.get<Transaction[]>(`/api/transactions/${clientId}`, { params });
    return response.data;
};

export const getTransactionCategories = async (clientId: string): Promise<string[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return ['Customer Payment', 'Payroll', 'Vendor Payment', 'Loan Payment', 'Office Expenses'];
    }

    const response = await apiClient.get<string[]>(`/api/transactions/${clientId}/categories`);
    return response.data;
};

// Recommendation Services
export const getRecommendations = async (clientId: string): Promise<Recommendation[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return mockRecommendations.filter(r => r.clientId === clientId);
    }

    const response = await apiClient.get<Recommendation[]>(`/api/recommendations/${clientId}`);
    return response.data;
};

export const acceptRecommendation = async (data: AcceptRecommendationRequest): Promise<Recommendation> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const recommendation = mockRecommendations.find(r => r.id === data.recommendationId);
        if (!recommendation) throw new Error('Recommendation not found');
        return {
            ...recommendation,
            status: 'accepted',
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Current User'
        };
    }

    const response = await apiClient.post<Recommendation>(`/api/recommendations/${data.recommendationId}/accept`, data);
    return response.data;
};

export const rejectRecommendation = async (data: RejectRecommendationRequest): Promise<Recommendation> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const recommendation = mockRecommendations.find(r => r.id === data.recommendationId);
        if (!recommendation) throw new Error('Recommendation not found');
        return {
            ...recommendation,
            status: 'rejected',
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Current User'
        };
    }

    const response = await apiClient.post<Recommendation>(`/api/recommendations/${data.recommendationId}/reject`, data);
    return response.data;
};

// Treasury Product Services
export const getTreasuryProducts = async (): Promise<TreasuryProduct[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return mockTreasuryProducts;
    }

    const response = await apiClient.get<TreasuryProduct[]>('/api/products');
    return response.data;
};

export const getTreasuryProduct = async (productId: string): Promise<TreasuryProduct> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const product = mockTreasuryProducts.find(p => p.id === productId);
        if (!product) throw new Error('Product not found');
        return product;
    }

    const response = await apiClient.get<TreasuryProduct>(`/api/products/${productId}`);
    return response.data;
};

// Report Services
export const generateReport = async (data: GenerateReportRequest): Promise<ReportData> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return { ...mockReportData, clientId: data.clientId };
    }

    const response = await apiClient.post<ReportData>('/api/reports/generate', data);
    return response.data;
};

export const getReportPreview = async (clientId: string): Promise<ReportData> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return { ...mockReportData, clientId };
    }

    const response = await apiClient.get<ReportData>(`/api/reports/${clientId}/preview`);
    return response.data;
};

export const downloadReport = async (reportId: string, format: 'pdf' | 'excel' | 'html' = 'pdf'): Promise<Blob> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Return mock blob for testing
        return new Blob(['Mock report content'], { type: 'application/pdf' });
    }

    const response = await apiClient.get(`/api/reports/${reportId}/download`, {
        params: { format },
        responseType: 'blob'
    });
    return response.data;
};

export const emailReport = async (reportId: string, recipients: string[]): Promise<{ success: boolean }> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return { success: true };
    }

    const response = await apiClient.post<{ success: boolean }>(`/api/reports/${reportId}/email`, { recipients });
    return response.data;
};
