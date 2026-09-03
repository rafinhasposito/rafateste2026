import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log to console
    if (import.meta.env.DEV) { console.error("Uncaught error:", error, errorInfo); }
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-black text-white p-6 font-sans">
          <div className="max-w-md w-full text-center space-y-6">
            <h2 className="text-2xl font-semibold tracking-wider text-[#D4AF37]">
              Conexão Interrompida
            </h2>
            <p className="text-white/70">
              Algo não carregou corretamente. Por favor, recarregue a página para continuar.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded uppercase tracking-widest text-sm font-medium"
            >
              Recarregar
            </button>

            {isDev && (
              <div className="mt-10 text-left bg-red-950/80 p-4 rounded text-xs text-red-200 overflow-auto border border-red-900/50 max-h-64">
                <p className="font-bold mb-2">Diagnóstico de Desenvolvimento:</p>
                <pre className="whitespace-pre-wrap">{this.state.error?.toString()}</pre>
                <details className="mt-2">
                  <summary className="cursor-pointer font-bold opacity-80 hover:opacity-100">Stack trace</summary>
                  <pre className="mt-2 opacity-70">{this.state.errorInfo?.componentStack}</pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
