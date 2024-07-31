import React, { Component, ReactNode, ErrorInfo } from "react";
import { MdError } from "react-icons/md";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleHomeRedirect = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className=" h-full flex items-center justify-center">
          <div className="h-72 w-96 gap-4 flex flex-col items-center justify-center border-2 border-red-500 shadow-md rounded">
            <MdError className="text-red-500" size={50} />
            <h1 className="text-lg">Something went wrong.</h1>
            <button
              onClick={this.handleHomeRedirect}
              className="py-2 px-4 bg-red-500 text-white"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
