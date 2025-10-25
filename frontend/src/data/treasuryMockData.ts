import {
    AnalysisMetrics,
    Client,
    Recommendation,
    Transaction,
    TreasuryProduct,
    UploadedFile,
    BankConnection
} from '@/types/treasury';

export const mockClients: Client[] = [
    {
        id: '1',
        name: 'Acme Manufacturing Corp',
        accountNumbers: ['1234567890', '0987654321'],
        relationshipManager: 'John Smith',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z'
    },
    {
        id: '2',
        name: 'TechStart Solutions LLC',
        accountNumbers: ['1122334455'],
        relationshipManager: 'Sarah Johnson',
        createdAt: '2024-02-01T09:00:00Z',
        updatedAt: '2024-02-10T12:00:00Z'
    }
];

export const mockUploadedFiles: UploadedFile[] = [
    {
        id: '1',
        name: 'January_Statement.pdf',
        type: 'application/pdf',
        size: 2048000,
        status: 'completed',
        clientId: '1',
        uploadedAt: '2024-01-20T10:00:00Z'
    },
    {
        id: '2',
        name: 'Q4_Transactions.csv',
        type: 'text/csv',
        size: 512000,
        status: 'processing',
        clientId: '1',
        uploadedAt: '2024-01-20T10:05:00Z'
    }
];

export const mockBankConnections: BankConnection[] = [
    {
        id: '1',
        bankName: 'Chase Business Banking',
        accountNumber: '****7890',
        connectionStatus: 'active',
        lastSync: '2024-01-20T08:00:00Z'
    },
    {
        id: '2',
        bankName: 'Bank of America Business',
        accountNumber: '****4321',
        connectionStatus: 'inactive',
        lastSync: '2024-01-15T12:00:00Z'
    }
];

export const mockTransactions: Transaction[] = [
    {
        id: '1',
        date: '2024-01-15',
        amount: 50000,
        type: 'credit',
        category: 'Customer Payment',
        description: 'Payment from ABC Corp',
        counterparty: 'ABC Corp',
        balanceAfter: 250000
    },
    {
        id: '2',
        date: '2024-01-16',
        amount: -25000,
        type: 'debit',
        category: 'Payroll',
        description: 'Employee Payroll',
        balanceAfter: 225000
    },
    {
        id: '3',
        date: '2024-01-17',
        amount: -5000,
        type: 'check',
        category: 'Vendor Payment',
        description: 'Office Supplies - Check #1234',
        counterparty: 'Office Depot',
        balanceAfter: 220000
    },
    {
        id: '4',
        date: '2024-01-18',
        amount: 75000,
        type: 'ach',
        category: 'Customer Payment',
        description: 'ACH Transfer from XYZ Inc',
        counterparty: 'XYZ Inc',
        balanceAfter: 295000
    },
    {
        id: '5',
        date: '2024-01-19',
        amount: -15000,
        type: 'wire',
        category: 'Loan Payment',
        description: 'Wire Transfer - Equipment Loan',
        counterparty: 'Equipment Finance Co',
        balanceAfter: 280000
    }
];

export const mockAnalysisMetrics: AnalysisMetrics = {
    clientId: '1',
    averageDailyBalance: 275000,
    totalInflows: 2500000,
    totalOutflows: 2100000,
    idleCashAmount: 180000,
    liquidityRatio: 1.19,
    cashFlowVolatility: 0.15,
    seasonalTrends: [
        {
            period: 'Q1',
            averageBalance: 260000,
            inflowPattern: 850000,
            outflowPattern: 720000
        },
        {
            period: 'Q2',
            averageBalance: 290000,
            inflowPattern: 920000,
            outflowPattern: 780000
        },
        {
            period: 'Q3',
            averageBalance: 275000,
            inflowPattern: 880000,
            outflowPattern: 750000
        },
        {
            period: 'Q4',
            averageBalance: 285000,
            inflowPattern: 950000,
            outflowPattern: 820000
        }
    ],
    paymentConcentration: [
        {
            vendor: 'ABC Corp',
            totalAmount: 450000,
            frequency: 24,
            percentage: 18.0
        },
        {
            vendor: 'XYZ Inc',
            totalAmount: 380000,
            frequency: 12,
            percentage: 15.2
        },
        {
            vendor: 'Equipment Finance Co',
            totalAmount: 180000,
            frequency: 12,
            percentage: 7.2
        }
    ]
};

export const mockTreasuryProducts: TreasuryProduct[] = [
    {
        id: '1',
        name: 'Automated Investment Sweep',
        description: 'Automatically invests idle cash balances into money market funds',
        category: 'investment',
        features: [
            'Automatic daily sweeps',
            'Same-day liquidity',
            'FDIC insured up to $250k per bank',
            'Competitive yield rates'
        ],
        eligibilityRules: {
            minBalance: 250000,
            businessType: ['corporation', 'llc', 'partnership']
        },
        estimatedYield: 4.5,
        fees: {
            monthly: 25,
            setup: 100
        },
        benefits: ['Maximize yield on idle cash', 'Maintain liquidity access', 'Reduce manual cash management']
    },
    {
        id: '2',
        name: 'ACH Origination Service',
        description: 'Streamline vendor payments and payroll with automated ACH processing',
        category: 'payment_services',
        features: [
            'Bulk payment processing',
            'Same-day and next-day ACH',
            'Payment approval workflows',
            'Detailed reporting and reconciliation'
        ],
        eligibilityRules: {
            minTransactionVolume: 100000
        },
        fees: {
            monthly: 50,
            perTransaction: 0.25,
            setup: 200
        },
        benefits: ['Reduce check processing costs', 'Faster payment processing', 'Enhanced security and tracking']
    },
    {
        id: '3',
        name: 'Zero Balance Account (ZBA)',
        description: 'Centralize cash management with automatic balance transfers',
        category: 'cash_management',
        features: [
            'Automatic balance transfers',
            'Centralized liquidity management',
            'Separate account tracking',
            'Detailed sub-account reporting'
        ],
        eligibilityRules: {
            minBalance: 100000
        },
        fees: {
            monthly: 35,
            setup: 150
        },
        benefits: ['Optimize cash positioning', 'Reduce idle balances', 'Improve cash visibility']
    },
    {
        id: '4',
        name: 'Remote Deposit Capture',
        description: 'Deposit checks electronically from your office',
        category: 'payment_services',
        features: [
            'Electronic check processing',
            'Mobile and desktop capture',
            'Same-day availability',
            'Fraud protection'
        ],
        eligibilityRules: {
            minTransactionVolume: 50000
        },
        fees: {
            monthly: 30,
            perTransaction: 0.15,
            setup: 100
        },
        benefits: ['Faster fund availability', 'Reduce transportation costs', 'Enhanced security']
    }
];

export const mockRecommendations: Recommendation[] = [
    {
        id: '1',
        clientId: '1',
        productId: '1',
        productName: 'Automated Investment Sweep',
        rationale:
            'Analysis shows sustained idle cash balances above $250k for 45+ days, indicating opportunity for yield optimization through automated sweep account.',
        dataSource: 'Average balance analysis',
        estimatedBenefit: 8100,
        benefitType: 'yield_improvement',
        priority: 'high',
        status: 'pending',
        createdAt: '2024-01-20T15:30:00Z'
    },
    {
        id: '2',
        clientId: '1',
        productId: '2',
        productName: 'ACH Origination Service',
        rationale:
            '80% of vendor payments are processed via manual checks. ACH origination would reduce processing costs and improve payment timing.',
        dataSource: 'Transaction type distribution',
        estimatedBenefit: 3600,
        benefitType: 'cost_reduction',
        priority: 'high',
        status: 'pending',
        createdAt: '2024-01-20T15:30:00Z'
    },
    {
        id: '3',
        clientId: '1',
        productId: '4',
        productName: 'Remote Deposit Capture',
        rationale:
            'High weekend deposit volumes indicate significant check processing activity. RDC would provide faster fund availability.',
        dataSource: 'Inflow pattern analysis',
        estimatedBenefit: 2400,
        benefitType: 'efficiency',
        priority: 'medium',
        status: 'pending',
        createdAt: '2024-01-20T15:30:00Z'
    }
];

export const mockAnalysisStatus = {
    clientId: '1',
    stage: 'completed' as const,
    progress: 100,
    message: 'Analysis complete. 3 recommendations generated.',
    estimatedTimeRemaining: 0
};

export const mockReportData = {
    id: '1',
    clientId: '1',
    generatedAt: '2024-01-20T16:00:00Z',
    summary: {
        totalRecommendations: 3,
        estimatedTotalBenefit: 14100,
        keyInsights: [
            'Significant idle cash optimization opportunity',
            'Payment processing efficiency can be improved',
            'Cash concentration analysis reveals vendor payment patterns'
        ]
    },
    sections: {
        executiveSummary:
            'Based on analysis of transaction patterns, we identified significant opportunities for treasury optimization through automated cash management and payment processing improvements.',
        analysisResults: mockAnalysisMetrics,
        recommendations: mockRecommendations,
        nextSteps: [
            'Review and approve recommended treasury products',
            'Schedule implementation planning session',
            'Begin account setup and integration process',
            'Establish monitoring and reporting procedures'
        ]
    }
};
