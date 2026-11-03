const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV5.tsx';
let content = fs.readFileSync(file, 'utf8');

const errorBoundary = `
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 50, background: 'red', color: 'white', minHeight: '100vh', zIndex: 9999 }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error.toString()}</pre>
          <pre>{this.state.info.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
`;

if (!content.includes('class ErrorBoundary')) {
  content = content.replace('export default function AppleResultPreviewV5() {', errorBoundary + '\nexport default function AppleResultPreviewV5Wrapper() {\n  return <ErrorBoundary><AppleResultPreviewV5 /></ErrorBoundary>;\n}\n\nfunction AppleResultPreviewV5() {');
  fs.writeFileSync(file, content);
  console.log("Added ErrorBoundary to V5");
}
