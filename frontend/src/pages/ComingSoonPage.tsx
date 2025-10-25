import { Card, CardContent } from '@/components/ui/card';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ComingSoonPageProps {
    title: string;
    description?: string;
}

export const ComingSoonPage = ({
    title,
    description = 'This feature is currently under development and will be available soon.'
}: ComingSoonPageProps) => {
    return (
        <div className='max-w-2xl mx-auto'>
            <Card>
                <CardContent className='flex flex-col items-center justify-center py-16 text-center space-y-4'>
                    <div className='p-4 bg-muted/50 rounded-full'>
                        <Construction className='h-12 w-12 text-muted-foreground' />
                    </div>

                    <div className='space-y-2'>
                        <h1 className='text-2xl font-bold'>{title}</h1>
                        <p className='text-muted-foreground max-w-md'>{description}</p>
                    </div>

                    <Button
                        asChild
                        variant='outline'
                    >
                        <Link
                            to='/upload'
                            className='flex items-center gap-2'
                        >
                            <ArrowLeft className='h-4 w-4' />
                            Back to Upload
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
