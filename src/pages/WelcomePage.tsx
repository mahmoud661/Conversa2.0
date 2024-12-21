import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-2xl bg-primary p-4">
            <MessageSquare className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        <h1 className="mb-2 text-4xl font-bold">Welcome to ChatApp</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Connect with friends and chat with AI assistants
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="min-w-[120px]">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[120px]">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}