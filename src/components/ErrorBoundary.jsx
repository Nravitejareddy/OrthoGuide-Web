import React from "react"

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 text-center bg-red-50 border border-red-100 rounded-3xl m-4 animate-fade-in">
          <div className="max-w-md">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h2 className="text-2xl font-black text-red-900 mb-2">Interface Error</h2>
            <p className="text-sm text-red-600/70 font-medium mb-8 leading-relaxed">
              Something went wrong while rendering this section of the dashboard. Our team has been notified.
              <br/>
              <span className="mt-4 block p-3 bg-white/50 rounded-xl border border-red-100 text-[10px] font-mono text-red-500 overflow-hidden text-ellipsis whitespace-nowrap">
                {this.state.error?.message || "Unknown Runtime Error"}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                onClick={() => window.location.reload()} 
                className="px-8 py-3 bg-red-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
                >
                Refresh Page
                </button>
                <button 
                onClick={() => this.setState({ hasError: false, error: null })} 
                className="px-8 py-3 bg-white border border-red-100 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-50 transition-all active:scale-95"
                >
                Try Again
                </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
