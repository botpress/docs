---
title: Header
excerpt: ''
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
![](https://files.readme.io/90fda8b-image.png)

<br />

```jsx /Header/
import "./style.css"
import theme from "./theme.json"

import { Header, Container, WebchatProvider, useClient } from '@botpress/webchat'

const App = () => {
  const client = useClient({ clientId: '453254325-54325-435-345-345534253' })

  return (
    <WebchatProvider client={client} theme={theme}>
      <Container>
        <Header />
      </Container>
    </WebchatProvider>
  )
}
```

[Demo Example](https://stackblitz.com/github/botpress/documentation-examples/tree/master/examples/webchat-react-header?embed=1\&hideNavigation=1\&view=both\&file=src%2FApp.tsx)
