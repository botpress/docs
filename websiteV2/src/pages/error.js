const React = require('react')

import Layout from "@theme/Layout";

const Error = () => {
  return (
    <div className="error">
      <div className="container">
        <div className="robot">🤖</div>
        <div className="message">Oops! Page not found.</div>
      </div>
    </div>
  )
}

export default props => <Layout><Error {...props} /></Layout>;
