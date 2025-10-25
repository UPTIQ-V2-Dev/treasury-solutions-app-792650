import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UploadPage } from '@/pages/UploadPage';
import { ComingSoonPage } from '@/pages/ComingSoonPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route
                        path='/'
                        element={
                            <Navigate
                                to='/upload'
                                replace
                            />
                        }
                    />
                    <Route
                        path='/'
                        element={<DashboardLayout />}
                    >
                        <Route
                            path='upload'
                            element={<UploadPage />}
                        />
                        <Route
                            path='analysis'
                            element={
                                <ComingSoonPage
                                    title='Analysis Dashboard'
                                    description='Advanced transaction analysis and cash flow insights will be available here soon.'
                                />
                            }
                        />
                        <Route
                            path='recommendations'
                            element={
                                <ComingSoonPage
                                    title='Treasury Recommendations'
                                    description='AI-powered treasury product recommendations based on your transaction patterns.'
                                />
                            }
                        />
                        <Route
                            path='reports'
                            element={
                                <ComingSoonPage
                                    title='Reports & Analytics'
                                    description='Comprehensive treasury reports and downloadable summaries.'
                                />
                            }
                        />
                        <Route
                            path='admin/users'
                            element={
                                <ComingSoonPage
                                    title='User Management'
                                    description='Manage user roles and permissions for the treasury platform.'
                                />
                            }
                        />
                        <Route
                            path='admin/settings'
                            element={
                                <ComingSoonPage
                                    title='System Settings'
                                    description='Configure system parameters and treasury analysis rules.'
                                />
                            }
                        />
                    </Route>
                </Routes>
                <Toaster />
            </Router>
        </QueryClientProvider>
    );
};
