import React from "react";
import { BsExclamationTriangle } from "react-icons/bs";

// Catches render-time crashes so a single broken component doesn't blank the app.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled render error:", error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex flex-col justify-center items-center w-full h-[60vh] gap-3 px-4">
        <div className="w-14 h-14 flex items-center justify-center bg-danger/10 border-2 border-danger rounded-retro">
          <BsExclamationTriangle className="text-danger text-xl" />
        </div>
        <h2 className="font-bold text-base text-text-primary text-center">
          This page crashed
        </h2>
        <p className="text-xs text-text-muted text-center max-w-sm">
          {this.state.error?.message || "An unexpected error occurred."}
        </p>
        <button onClick={this.handleReset} className="retro-btn mt-1">
          Try again
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
