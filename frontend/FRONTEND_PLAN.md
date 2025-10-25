# Treasury Solutions Application - Frontend Implementation Plan

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4, Shadcn/ui
- **Testing**: Vitest, React Testing Library, MSW
- **State Management**: Zustand/React Context
- **HTTP Client**: TanStack Query + Axios
- **File Upload**: React Dropzone
- **Charts**: Recharts
- **PDF Generation**: jsPDF/Puppeteer

## Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn/ui components
│   ├── layout/          # Layout components
│   ├── charts/          # Chart components
│   └── common/          # Shared components
├── pages/               # Page components
├── hooks/               # Custom hooks
├── lib/                 # Utilities
├── types/               # TypeScript types
├── services/            # API services
├── store/               # State management
├── constants/           # App constants
└── __tests__/           # Test files
```

## Page-by-Page Implementation Plan

### 1. Authentication & Layout (Phase 1)

#### Components:

- `LoginPage` - SSO/role-based authentication
- `DashboardLayout` - Main layout with navigation
- `Header` - Fixed header with user info and logout
- `Sidebar` - Navigation menu (collapsed on mobile)

#### API Endpoints:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

#### Types:

```typescript
interface User {
    id: string;
    name: string;
    role: 'RM' | 'Admin' | 'Viewer';
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}
```

### 2. File Upload Page (Phase 2)

#### Components:

- `UploadPage` - Main upload interface
- `FileDropzone` - Drag & drop file upload
- `ConnectionModal` - Bank connection interface
- `UploadProgress` - Progress indicator
- `FilePreview` - Uploaded file preview

#### Features:

- Drag & drop file upload (PDF, CSV)
- Bank connection via API
- File validation & error handling
- Upload progress tracking

#### API Endpoints:

- `POST /api/statements/upload`
- `GET /api/banks/connections`
- `POST /api/banks/connect`

#### Types:

```typescript
interface UploadedFile {
    id: string;
    name: string;
    type: string;
    size: number;
    status: 'uploading' | 'processing' | 'completed' | 'error';
}

interface BankConnection {
    id: string;
    bankName: string;
    accountNumber: string;
    connectionStatus: 'active' | 'inactive';
}
```

### 3. Data Processing & Analysis Dashboard (Phase 3)

#### Components:

- `ProcessingPage` - Loading and progress display
- `AnalysisDashboard` - Main analytics view
- `MetricsCards` - Key financial metrics
- `TransactionTable` - Categorized transactions
- `CashFlowChart` - Visual cash flow trends
- `LiquidityHeatmap` - Liquidity analysis visualization

#### Features:

- Real-time processing status
- Interactive charts and graphs
- Transaction categorization display
- Filtering by date, category, amount
- Drill-down capabilities

#### API Endpoints:

- `GET /api/analysis/:clientId/status`
- `GET /api/analysis/:clientId/metrics`
- `GET /api/transactions/:clientId`
- `GET /api/analysis/:clientId/trends`

#### Types:

```typescript
interface AnalysisMetrics {
    averageDailyBalance: number;
    totalInflows: number;
    totalOutflows: number;
    idleCashAmount: number;
    liquidityRatio: number;
}

interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: 'credit' | 'debit' | 'transfer';
    category: string;
    description: string;
    counterparty?: string;
}
```

### 4. Treasury Recommendations Page (Phase 4)

#### Components:

- `RecommendationsPage` - Main recommendations view
- `ProductCard` - Individual product recommendation
- `BenefitCalculator` - Financial benefit estimator
- `RationaleModal` - Detailed recommendation rationale
- `ComparisonTable` - Side-by-side product comparison

#### Features:

- Card-based product recommendations
- Financial benefit calculations
- Detailed rationale for each recommendation
- Product comparison functionality
- Acceptance/rejection tracking

#### API Endpoints:

- `GET /api/recommendations/:clientId`
- `GET /api/products/:productId`
- `POST /api/recommendations/:id/accept`
- `POST /api/recommendations/:id/reject`

#### Types:

```typescript
interface Recommendation {
    id: string;
    productId: string;
    productName: string;
    rationale: string;
    estimatedBenefit: number;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'accepted' | 'rejected';
}

interface TreasuryProduct {
    id: string;
    name: string;
    description: string;
    features: string[];
    eligibilityRules: Record<string, any>;
    estimatedYield: number;
}
```

### 5. Report Generation Page (Phase 5)

#### Components:

- `ReportPage` - Report configuration and preview
- `ReportPreview` - PDF preview component
- `ReportCustomizer` - Report customization options
- `ExportButtons` - Download/share functionality

#### Features:

- PDF report generation
- Report customization
- Export in multiple formats
- Email sharing functionality

#### API Endpoints:

- `GET /api/reports/:clientId/preview`
- `POST /api/reports/generate`
- `POST /api/reports/email`

### 6. Admin & Configuration Pages (Phase 6)

#### Components:

- `AdminDashboard` - Admin overview
- `ConfigurationPanel` - System configuration
- `UserManagement` - User roles and permissions
- `AuditLog` - Activity tracking

#### Features:

- System configuration management
- User role administration
- Audit trail viewing
- Performance monitoring

## Common Components & Utils

### Layout Components:

- `AppLayout` - Main application wrapper
- `PageHeader` - Standard page header
- `LoadingSpinner` - Loading indicator
- `ErrorBoundary` - Error handling wrapper

### UI Components (Shadcn/ui):

- Button, Card, Dialog, Table, Input
- Select, Checkbox, Progress, Alert
- Tabs, Badge, Tooltip, Sheet

### Charts & Visualization:

- `LineChart` - Cash flow trends
- `BarChart` - Transaction categories
- `PieChart` - Spending distribution
- `Heatmap` - Liquidity visualization

### Utilities:

- `formatCurrency` - Currency formatting
- `dateUtils` - Date manipulation
- `fileUtils` - File handling
- `validationUtils` - Form validation

## API Integration Strategy

### Services Architecture:

```typescript
// services/api.ts
export class ApiClient {
    async uploadStatement(file: File): Promise<UploadResponse>;
    async getAnalysis(clientId: string): Promise<AnalysisData>;
    async getRecommendations(clientId: string): Promise<Recommendation[]>;
    async generateReport(clientId: string): Promise<ReportData>;
}
```

### Error Handling:

- Global error boundary
- Toast notifications for errors
- Retry mechanisms for failed requests
- Offline state handling

## State Management

### Store Structure (Zustand):

```typescript
interface AppStore {
    // Auth
    user: User | null;
    setUser: (user: User) => void;

    // Upload
    uploadedFiles: UploadedFile[];
    addFile: (file: UploadedFile) => void;

    // Analysis
    analysisData: AnalysisMetrics | null;
    setAnalysisData: (data: AnalysisMetrics) => void;

    // Recommendations
    recommendations: Recommendation[];
    setRecommendations: (recs: Recommendation[]) => void;
}
```

## Testing Strategy

### Test Organization:

```
src/
├── __tests__/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── utils/
├── setupTests.ts
└── test-utils.tsx
```

### Testing Framework Setup:

#### 1. Vitest Configuration:

```typescript
// vitest.config.ts
export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        css: true
    }
});
```

#### 2. Test Setup Files:

```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### 3. Test Utilities:

```typescript
// src/test-utils.tsx
export function renderWithProviders(
    ui: React.ReactElement,
    options?: {
        initialState?: Partial<AppStore>;
        route?: string;
    }
) {
    // Custom render with providers
}

export const mockUser = {
    id: '1',
    name: 'Test User',
    role: 'RM' as const,
    email: 'test@example.com'
};
```

### Test Categories:

#### 1. Component Tests:

```typescript
// __tests__/components/FileDropzone.test.tsx
describe('FileDropzone', () => {
  it('should accept valid file uploads', async () => {
    const onUpload = vi.fn();
    render(<FileDropzone onUpload={onUpload} />);

    const file = new File(['test'], 'statement.pdf', { type: 'application/pdf' });
    const dropzone = screen.getByRole('button', { name: /upload/i });

    await user.upload(dropzone, file);
    expect(onUpload).toHaveBeenCalledWith(file);
  });
});
```

#### 2. Page Tests:

```typescript
// __tests__/pages/UploadPage.test.tsx
describe('UploadPage', () => {
  it('should navigate to analysis after successful upload', async () => {
    server.use(
      http.post('/api/statements/upload', () => {
        return HttpResponse.json({ success: true, id: '123' });
      })
    );

    renderWithProviders(<UploadPage />);
    // Test upload flow
  });
});
```

#### 3. Hook Tests:

```typescript
// __tests__/hooks/useFileUpload.test.tsx
describe('useFileUpload', () => {
    it('should handle upload progress', async () => {
        const { result } = renderHook(() => useFileUpload());

        act(() => {
            result.current.uploadFile(mockFile);
        });

        await waitFor(() => {
            expect(result.current.progress).toBe(100);
        });
    });
});
```

#### 4. Service Tests:

```typescript
// __tests__/services/api.test.ts
describe('ApiClient', () => {
    it('should upload statement successfully', async () => {
        server.use(
            http.post('/api/statements/upload', () => {
                return HttpResponse.json({ id: '123', status: 'processing' });
            })
        );

        const response = await apiClient.uploadStatement(mockFile);
        expect(response.id).toBe('123');
    });
});
```

### MSW Mock Setup:

```typescript
// src/mocks/handlers.ts
export const handlers = [
    http.get('/api/auth/me', () => {
        return HttpResponse.json(mockUser);
    }),

    http.post('/api/statements/upload', () => {
        return HttpResponse.json({
            id: '123',
            status: 'processing'
        });
    }),

    http.get('/api/analysis/:clientId/metrics', () => {
        return HttpResponse.json({
            averageDailyBalance: 250000,
            totalInflows: 1000000,
            totalOutflows: 800000
        });
    })
];
```

### Test Coverage Requirements:

- **Components**: 90%+ coverage
- **Pages**: 85%+ coverage
- **Hooks**: 95%+ coverage
- **Services**: 90%+ coverage
- **Utilities**: 95%+ coverage

### Key Test Scenarios:

#### Form Validation Tests:

- File type validation
- File size limits
- Required field validation
- Error message display

#### State Management Tests:

- Store updates
- Async actions
- Error handling
- Data persistence

#### Integration Tests:

- End-to-end user workflows
- API integration
- Navigation flows
- Error boundary handling

#### Accessibility Tests:

- Keyboard navigation
- Screen reader compatibility
- ARIA labels
- Focus management

## Development Phases

### Phase 1: Foundation (Week 1-2)

- Project setup with Vite, React 19, TypeScript
- Shadcn/ui and Tailwind v4 configuration
- Authentication system
- Basic layout components
- Test framework setup

### Phase 2: Core Features (Week 3-4)

- File upload functionality
- Data processing dashboard
- API integration layer
- Component tests

### Phase 3: Analysis & Visualization (Week 5-6)

- Analytics dashboard
- Charts and visualizations
- Transaction management
- Integration tests

### Phase 4: Recommendations (Week 7-8)

- Recommendation engine UI
- Product comparison features
- Report generation
- End-to-end tests

### Phase 5: Admin & Polish (Week 9-10)

- Admin functionality
- Performance optimization
- Accessibility improvements
- Full test coverage

## Performance Considerations

### Optimization Strategies:

- React.lazy for code splitting
- Virtualized lists for large datasets
- Memoization for expensive calculations
- Image optimization
- Bundle size monitoring

### Loading States:

- Skeleton loaders for data fetching
- Progressive loading for charts
- Optimistic updates where appropriate

## Accessibility & UX Requirements

### Accessibility:

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Focus management

### Responsive Design:

- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Touch-friendly interactions

This implementation plan provides a comprehensive roadmap for building the Treasury Solutions application with modern React practices, thorough testing, and excellent user experience.
