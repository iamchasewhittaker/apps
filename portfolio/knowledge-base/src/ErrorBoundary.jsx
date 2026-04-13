import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(err) { return { error: err }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 24, color: "#f87171", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>Something went wrong in {this.props.name}</div>
        <div style={{ fontSize: 12, color: "#71717a", marginBottom: 16 }}>{this.state.error.message}</div>
        <button onClick={() => this.setState({ error: null })}
          style={{ padding: "8px 16px", borderRadius: 8, background: "#1f2937",
            border: "1px solid #3f3f46", color: "#d4d4d8", cursor: "pointer", fontFamily: "inherit" }}>
          Try again
        </button>
      </div>
    );
    return this.props.children;
  }
}
