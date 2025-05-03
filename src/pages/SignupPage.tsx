import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { Notification } from '@/components/ui/notification';
import validatePassword from '@/lib/passwordvalidation';
import { calculatePasswordStrength, getPasswordFeedback } from '@/lib/passwordStrength';
import { PasswordInput } from '@/components/ui/password-input';

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: '' });

  // Update password strength when password changes
  useEffect(() => {
    if (password) {
      const strengthResult = calculatePasswordStrength(password);
      setPasswordStrength(strengthResult);
      
      // Update validation errors
      const feedback = getPasswordFeedback(password);
      setPasswordError(feedback);
    } else {
      setPasswordStrength({ strength: 0, label: '' });
      setPasswordError(null);
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError(null);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const passwordValidation = validatePassword(password);
    
    if (name.length < 2) {
      setError('Name must be at least 2 characters');
    } else if (!email.includes('@')) {
      setError('Please enter a valid email');
    } else if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
    } else if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      // Success - navigate to chat page
      navigate('/chat');
    }
    
    setLoading(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {error && (
        <Notification
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
      <Card className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl bg-primary p-4">
              <MessageSquare className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Create a password"
            required
            autoComplete="new-password"
            error={passwordError}
            showStrengthMeter={true}
            strength={passwordStrength.strength}
            strengthLabel={passwordStrength.label}
          />
          
          <PasswordInput
            id="confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your password"
            required
            autoComplete="new-password"
            error={confirmPasswordError}
          />
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}