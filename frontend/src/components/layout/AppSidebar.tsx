import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { Upload, BarChart3, TrendingUp, FileText, Settings, Building2, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigationItems = [
    {
        title: 'File Upload',
        icon: Upload,
        href: '/upload'
    },
    {
        title: 'Analysis Dashboard',
        icon: BarChart3,
        href: '/analysis'
    },
    {
        title: 'Recommendations',
        icon: TrendingUp,
        href: '/recommendations'
    },
    {
        title: 'Reports',
        icon: FileText,
        href: '/reports'
    }
];

const adminItems = [
    {
        title: 'User Management',
        icon: Users,
        href: '/admin/users'
    },
    {
        title: 'System Settings',
        icon: Settings,
        href: '/admin/settings'
    }
];

export const AppSidebar = () => {
    const location = useLocation();

    return (
        <Sidebar>
            <SidebarHeader className='p-4 border-b'>
                <div className='flex items-center gap-2'>
                    <Building2 className='h-6 w-6 text-primary' />
                    <span className='font-semibold text-lg'>Treasury Solutions</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Features</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map(item => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.href}
                                    >
                                        <Link to={item.href}>
                                            <item.icon className='h-4 w-4' />
                                            {item.title}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Administration</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {adminItems.map(item => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.href}
                                    >
                                        <Link to={item.href}>
                                            <item.icon className='h-4 w-4' />
                                            {item.title}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className='p-4 border-t'>
                <div className='text-xs text-muted-foreground text-center'>Treasury Solutions v1.0</div>
            </SidebarFooter>
        </Sidebar>
    );
};
