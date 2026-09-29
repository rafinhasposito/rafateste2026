const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const boundaryCode = `
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
    this.setState({ info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 50, background: 'black', color: 'red', zIndex: 9999, position: 'relative' }}>
          <h1>Something went wrong in AppleResultPreview.</h1>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          <pre style={{fontSize: 10}}>{this.state.info && this.state.info.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
`;

if (!code.includes('class ErrorBoundary')) {
    code = code.replace('export default function AppleResultPreview(props: DestinyResultsProps) {', 
    `${boundaryCode}\n\nexport default function AppleResultPreviewWrapper(props: DestinyResultsProps) {\n  return <ErrorBoundary><AppleResultPreview {...props} /></ErrorBoundary>;\n}\n\nfunction AppleResultPreview(props: DestinyResultsProps) {`);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Error Boundary Injected!");
} else {
    console.log("Error Boundary already present.");
}
