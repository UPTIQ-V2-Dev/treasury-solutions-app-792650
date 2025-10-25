export interface Client {
    id: string;
    name: string;
    accountNumbers: string[];
    relationshipManager: string;
    createdAt: string;
    updatedAt: string;
}

export interface UploadedFile {
    id: string;
    name: string;
    type: string;
    size: number;
    status: 'uploading' | 'processing' | 'completed' | 'error';
    clientId?: string;
    uploadedAt: string;
    errorMessage?: string;
}

export interface BankConnection {
    id: string;
    bankName: string;
    accountNumber: string;
    connectionStatus: 'active' | 'inactive' | 'pending';
    lastSync?: string;
}

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: 'credit' | 'debit' | 'transfer' | 'check' | 'ach' | 'wire' | 'card';
    category: string;
    description: string;
    counterparty?: string;
    balanceAfter: number;
}

export interface AnalysisMetrics {
    clientId: string;
    averageDailyBalance: number;
    totalInflows: number;
    totalOutflows: number;
    idleCashAmount: number;
    liquidityRatio: number;
    cashFlowVolatility: number;
    seasonalTrends: SeasonalTrend[];
    paymentConcentration: PaymentConcentration[];
}

export interface SeasonalTrend {
    period: string;
    averageBalance: number;
    inflowPattern: number;
    outflowPattern: number;
}

export interface PaymentConcentration {
    vendor: string;
    totalAmount: number;
    frequency: number;
    percentage: number;
}

export interface TreasuryProduct {
    id: string;
    name: string;
    description: string;
    category: 'cash_management' | 'investment' | 'payment_services' | 'liquidity';
    features: string[];
    eligibilityRules: {
        minBalance?: number;
        minTransactionVolume?: number;
        businessType?: string[];
    };
    estimatedYield?: number;
    fees: {
        monthly?: number;
        perTransaction?: number;
        setup?: number;
    };
    benefits: string[];
}

export interface Recommendation {
    id: string;
    clientId: string;
    productId: string;
    productName: string;
    rationale: string;
    dataSource: string;
    estimatedBenefit: number;
    benefitType: 'yield_improvement' | 'cost_reduction' | 'efficiency' | 'risk_mitigation';
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'accepted' | 'rejected' | 'under_review';
    createdAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
}

export interface AnalysisStatus {
    clientId: string;
    stage: 'uploaded' | 'parsing' | 'categorizing' | 'analyzing' | 'generating_recommendations' | 'completed' | 'error';
    progress: number;
    message: string;
    estimatedTimeRemaining?: number;
    errors?: string[];
}

export interface ReportData {
    id: string;
    clientId: string;
    generatedAt: string;
    summary: {
        totalRecommendations: number;
        estimatedTotalBenefit: number;
        keyInsights: string[];
    };
    sections: {
        executiveSummary: string;
        analysisResults: AnalysisMetrics;
        recommendations: Recommendation[];
        nextSteps: string[];
    };
}

// Request/Response Types
export interface UploadStatementRequest {
    files: File[];
    clientInfo: {
        name: string;
        accountNumbers: string[];
    };
}

export interface UploadStatementResponse {
    clientId: string;
    uploadId: string;
    files: UploadedFile[];
    status: string;
}

export interface ConnectBankRequest {
    bankName: string;
    accountNumber: string;
    credentials: {
        username?: string;
        accountId?: string;
        apiKey?: string;
    };
}

export interface ConnectBankResponse {
    connectionId: string;
    status: 'connected' | 'pending_verification' | 'failed';
    message: string;
}

export interface AcceptRecommendationRequest {
    recommendationId: string;
    comments?: string;
}

export interface RejectRecommendationRequest {
    recommendationId: string;
    reason: string;
    comments?: string;
}

export interface GenerateReportRequest {
    clientId: string;
    includeTransactionDetails: boolean;
    format: 'pdf' | 'excel' | 'html';
    customSections?: string[];
}

export type UserRole = 'RM' | 'Admin' | 'Viewer';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department?: string;
}
