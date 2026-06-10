import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

/**
 * Catches render-time crashes so a failure shows a calm, reassuring fallback
 * instead of a blank white screen. No data leaves the device.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Surfaced to the browser console only; nothing is sent off-device.
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mi-root">
        <div className="mi-wrap">
          <p className="mi-kicker">Something went wrong</p>
          <h1 className="mi-h1">This page hit a snag</h1>
          <div className="mi-card">
            <p className="mi-p">
              Sorry — the tool ran into an unexpected error. Any responses you saved
              are kept on this device and were not lost or sent anywhere.
            </p>
            <p className="mi-p">Reloading usually clears it.</p>
            <button className="mi-btn" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
