const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const boundaryCode = `
class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("Root error:", error, info); }
  render() {
    if (this.state.hasError) {
      return <div style={{background:'red', color:'white', padding:50}}>ROOT CRASH: {this.state.error?.toString()}</div>;
    }
    return this.props.children;
  }
}
`;

if (!code.includes('class RootErrorBoundary')) {
    code = code.replace('import { useEffect, useState } from "react";', `import React, { useEffect, useState } from "react";\n${boundaryCode}`);
    code = code.replace('export default function Dashboard() {', 'export default function DashboardWrapper() { return <RootErrorBoundary><Dashboard /></RootErrorBoundary>; }\nfunction Dashboard() {');
    fs.writeFileSync('src/pages/Dashboard.tsx', code);
    console.log("Root error boundary injected.");
}
