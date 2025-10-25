import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';

export const DashboardLayout = () => {
    return (
        <SidebarProvider>
            <div className='min-h-screen flex w-full bg-background'>
                <AppSidebar />
                <div className='flex-1 flex flex-col min-h-screen'>
                    <Header />
                    <main className='flex-1 overflow-auto'>
                        <div className='container mx-auto px-4 py-6 space-y-6'>
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};
