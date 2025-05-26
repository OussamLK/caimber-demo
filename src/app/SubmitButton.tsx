'use client';

interface SubmitButtonProps {
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function SubmitButton({
  isLoading = false,
  onClick,
  className = '',
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-md bg-black text-white font-medium
        flex items-center justify-center gap-2
        hover:bg-gray-700 transition-colors
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      Submit
    </button>
  );
}
