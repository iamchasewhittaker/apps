import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(err) { return { error: err }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 24, color: "#e05050", fontFamily: "-apple-system, sans-serif" }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Something went wrong in {this.props.name}</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>{this.state.error.message}</div>
        <button onClick={() => this.setState({ error: null })}
          style={{ padding: "8px 16px", borderRadius: 8, background: "#181e2e",
            border: "1px solid #c8a84b", color: "#c8a84b", cursor: "pointer", fontFamily: "inherit" }}>
          Try again
        </button>
      </div>
    );
    return this.props.children;
  }
}

export default ErrorBoundary;
