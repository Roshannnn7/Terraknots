'use client';
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB] p-8">
          <div className="max-w-2xl text-center">
            <div className="text-7xl mb-6">🧶</div>
            <h2 className="text-4xl font-serif mb-4 text-[#2C2C2C]">
              Something got tangled
            </h2>
            <p className="text-gray-600 mb-2 text-lg italic">
              We hit an unexpected error while weaving the page.
            </p>
            <p className="text-gray-500 mb-8">
              Don't worry — your data is safe. Try refreshing.
            </p>
            
            <div className="flex gap-4 justify-center mb-8">
              <button 
                onClick={this.handleReset}
                className="px-8 py-3 bg-[#C4A882] text-white rounded-full hover:bg-[#8B7355] transition-all hover:shadow-lg"
              >
                Refresh Page
              </button>
              <a 
                href="/admin/dashboard"
                className="px-8 py-3 border-2 border-[#C4A882] text-[#8B7355] rounded-full hover:bg-[#F2D7C9] transition-all"
              >
                Back to Dashboard
              </a>
            </div>
            
            <details className="text-left bg-white/50 p-4 rounded-2xl">
              <summary className="cursor-pointer font-semibold text-sm text-[#8B7355] uppercase tracking-widest">
                Technical Details
              </summary>
              <div className="mt-4">
                <p className="text-xs text-red-600 mb-2 font-mono">
                  {this.state.error?.toString()}
                </p>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-40">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
