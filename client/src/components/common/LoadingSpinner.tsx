interface Props {
  size?: number;
}

export default function LoadingSpinner({ size = 32 }: Props) {
  return (
    <div className="spinner-wrapper" role="status" aria-label="Loading">
      <div className="spinner" style={{ width: size, height: size }} />
    </div>
  );
}
