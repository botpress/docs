---
title: Fab
excerpt: Floating Action Button
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
<Image align="center" src="https://files.readme.io/38b71ad-image.png" />

<br />

```jsx /Fab/
import "./style.css"
import theme from "./theme.json"

import { Fab, Container, WebchatProvider, useClient } from '@botpress/webchat'

const App = () => {
  const client = useClient({ clientId: '453254325-54325-435-345-345534253' })

  return (
    <WebchatProvider client={client} theme={theme}>
      <Container>
        <Fab />
      </Container>
    </WebchatProvider>
  )
}
```

[Demo Example](https://stackblitz.com/github/botpress/documentation-examples/tree/master/examples/webchat-react-fab?embed=1\&hideNavigation=1\&view=both\&file=src%2FApp.tsx)
