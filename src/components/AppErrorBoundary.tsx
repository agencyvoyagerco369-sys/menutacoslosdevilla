import { Component, ErrorInfo, ReactNode } from "react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App render error", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
          <section className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Vista protegida
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold text-foreground">
              La app encontró un problema al cargar
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Puedes recargar la página y volver al menú sin quedarte con la pantalla en blanco.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Recargar app
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
