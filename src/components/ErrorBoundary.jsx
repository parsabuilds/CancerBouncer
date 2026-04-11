import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-6">
          <div className="text-center">
            <div className="text-5xl mb-4">&#9888;&#65039;</div>
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-6">We&apos;re having trouble loading this page.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
