'use client';
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBF9F7] p-8">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-4">🧶</div>
            <h2 className="text-2xl font-heading font-bold text-dark mb-3">Something got tangled</h2>
            <p className="text-light italic font-accent text-lg mb-6">
              We hit an unexpected error while weaving the page. Please refresh.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              Refresh Page
            </button>
            <details className="mt-10 text-left text-[10px] text-light uppercase tracking-widest bg-white p-4 rounded-2xl border border-gray-100">
              <summary className="cursor-pointer font-bold mb-2">Technical Snag Details</summary>
              <pre className="mt-2 p-3 bg-background rounded-xl overflow-auto lowercase font-mono">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
