---
title: Composer
excerpt: Webchat Advance Components
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
The webchat offers 4 advanced components to help you build a more advanced version of the webchat. These components are:

## Composer

![](https://files.readme.io/b5b4cc6-image.png)

<br />

```jsx /Composer/
import "./style.css"
import theme from "./theme.json"

import { Composer, Container, WebchatProvider, useClient } from '@botpress/webchat'

const App = () => {
  const client = useClient({ clientId: '453254325-54325-435-345-345534253' })

  return (
    <WebchatProvider client={client} theme={theme}>
      <Container>
        <Composer />
      </Container>
    </WebchatProvider>
  )
}
```

[Demo Example](https://stackblitz.com/github/botpress/documentation-examples/tree/master/examples/webchat-react-composer?embed=1\&hideNavigation=1\&view=both\&file=src%2FApp.tsx)
