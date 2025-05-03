import { useState } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string | null;
  className?: string;
  showStrengthMeter?: boolean;
  strength?: number;
  strengthLabel?: string | null;
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
  autoComplete,
  error,
  className = "",
  showStrengthMeter = false,
  strength = 0,
  strengthLabel,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const getBarColor = () => {
    if (!strength) return 'bg-gray-300 dark:bg-gray-600';
    if (strength < 30) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 70) return 'bg-yellow-500';
    if (strength < 90) return 'bg-green-400';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={className}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {showStrengthMeter && value && (
        <div className="mt-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full ${getBarColor()}`}
              style={{ width: `${strength}%` }}
            ></div>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Weak</span>
            {strengthLabel && (
              <span className="text-xs font-medium">{strengthLabel}</span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">Strong</span>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}