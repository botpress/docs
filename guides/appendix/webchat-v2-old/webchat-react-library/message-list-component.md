---
title: Message List Component
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
The `MessageList` component is a component that will render the list of messages in the webchat. This component can be used to add custom messages to the webchat.

![](https://files.readme.io/60e7480-image.png)

<br />

```jsx /MessageList/
import "./style.css"
import theme from "./theme.json"

import { MessageList, Container, WebchatProvider, useClient } from '@botpress/webchat'

const App = () => {
  const client = useClient({ clientId: '453254325-54325-435-345-345534253' })

  return (
    <WebchatProvider client={client} theme={theme}>
      <Container>
        <MessageList />
      </Container>
    </WebchatProvider>
  )
}
```

 [Demo Example](https://stackblitz.com/github/botpress/documentation-examples/tree/master/examples/webchat-react-message-list?embed=1\&hideNavigation=1\&view=both\&file=src%2FApp.tsx)
