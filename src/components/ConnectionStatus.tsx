interface ConnectionStatusProps {
  isConnecting: boolean;
  errorMessage: string | null;
  className?: string;
}

/**
 * Displays connection status including loading indicator and error messages
 *
 * @param isConnecting - Whether connection is currently in progress
 * @param errorMessage - Error message to display, if any
 * @param className - Optional additional CSS classes
 */
export default function ConnectionStatus({
  isConnecting,
  errorMessage,
  className = "",
}: ConnectionStatusProps): React.ReactElement {
  return (
    <div className={className}>
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {errorMessage}
        </div>
      )}

      {isConnecting && (
        <div className="flex items-center justify-center gap-2 py-2 text-blue-600">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Connecting...</span>
          <p className="text-xs text-gray-500 ml-2">
            This may take a few moments
          </p>
        </div>
      )}
    </div>
  );
}
