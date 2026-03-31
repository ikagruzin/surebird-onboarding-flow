interface ValidationErrorProps {
  message?: string;
}

export const ValidationError = ({ message }: ValidationErrorProps) => {
  if (!message) return null;
  return (
    <p className="text-sm text-destructive mt-1.5 animate-fade-in">
      {message}
    </p>
  );
};
