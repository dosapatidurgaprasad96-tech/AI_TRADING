import React, { useState } from 'react';
import { cn } from './Card';
import { Eye, EyeOff } from 'lucide-react';

export const Input = React.forwardRef(({ className, label, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={cn(
            "flex h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 transition-shadow",
            isPassword && "pr-10",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
});
Input.displayName = 'Input';
