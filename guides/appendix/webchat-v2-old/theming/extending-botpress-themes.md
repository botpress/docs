---
title: Extending Botpress themes
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
Botpress provides a variety of themes that you can use to customize the appearance of the webchat. You can extend those themes by generating your own theme object and stylesheet.

# What it looks like

```jsx /buildTheme/
import { Webchat, WebchatProvider, getClient } from '@botpress/webchat';
import { buildTheme } from '@botpress/webchat-generator';

/**
 * Build the theme object and stylesheet
 * The theme object and style can be generated using the `@botpress/webchat-generator` package
 * Style is a string that contains the CSS
 * Theme is an object that contains the theme configuration
 * Both of them can be exported to be used in the WebchatProvider
 */
const { style, theme } = buildTheme({
  themeName: 'prism',
  themeColor: '#634433',
})

export default function App() {
  const client = getClient({ clientId: '453254325-54325-435-345-345534253' });

  return (
    <WebchatProvider client={client} theme={theme}>
      <style>{style}</style>
      <Webchat />
    </WebchatProvider>
  );
}
```

# Demo

[https://stackblitz.com/github/botpress/documentation-examples/tree/master/examples/webchat-theme-generator?embed=1\&hideNavigation=1\&view=both\&file=src%2FApp.tsx](https://stackblitz.com/github/botpress/documentation-examples/tree/master/examples/webchat-theme-generator?embed=1\&hideNavigation=1\&view=both\&file=src%2FApp.tsx)
