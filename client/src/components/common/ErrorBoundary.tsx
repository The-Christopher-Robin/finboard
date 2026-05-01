import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback" role="alert">
          <h2>Something went wrong</h2>
          <p>An unexpected error occurred. Please try again.</p>
          <button className="btn btn-primary" onClick={this.handleRetry}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
