import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, User, LogOut } from 'lucide-react';

export const Header = () => {
    const currentUser = {
        name: 'John Smith',
        role: 'Relationship Manager',
        email: 'john.smith@bank.com'
    };

    return (
        <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='flex items-center justify-between px-4 py-3'>
                <div className='flex items-center gap-3'>
                    <SidebarTrigger />
                    <h1 className='font-semibold text-lg hidden sm:block'>Treasury Solutions Dashboard</h1>
                </div>

                <div className='flex items-center gap-3'>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='relative'
                    >
                        <Bell className='h-5 w-5' />
                        <div className='absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full' />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='ghost'
                                className='flex items-center gap-2 px-3'
                            >
                                <Avatar className='h-8 w-8'>
                                    <AvatarFallback className='text-sm'>
                                        {currentUser.name
                                            .split(' ')
                                            .map(n => n[0])
                                            .join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='hidden md:flex flex-col items-start'>
                                    <span className='text-sm font-medium'>{currentUser.name}</span>
                                    <span className='text-xs text-muted-foreground'>{currentUser.role}</span>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align='end'
                            className='w-56'
                        >
                            <DropdownMenuLabel>
                                <div className='flex flex-col space-y-1'>
                                    <p className='text-sm font-medium leading-none'>{currentUser.name}</p>
                                    <p className='text-xs leading-none text-muted-foreground'>{currentUser.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className='mr-2 h-4 w-4' />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='text-red-600'>
                                <LogOut className='mr-2 h-4 w-4' />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};
