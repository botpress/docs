---
title: Chat Header
excerpt: ''
deprecated: false
hidden: false
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
![](https://files.readme.io/4762e7a-image.png)

<br />

1. You can Customize the Chatbot Header using below CSS

```css
/* This block of CSS code styles a header icon element */
.bpw-header-icon {
  /* Remove border */
  border: none;
  /* Remove background color */
  background: none;
  /* Remove padding */
  padding: 0;
  /* Remove margin */
  margin: 0;
  /* Set text color to a variable named shark */
  color: var(--shark);
  /* Set line-height to zero */
  line-height: 0;
  /* Set left margin to a variable named spacing-large */
  margin-left: var(--spacing-large);
  /* Align text to the right */
  text-align: right;
  /* Align element vertically in the middle */
  vertical-align: middle;
  /* Set cursor to a pointer */
  cursor: pointer;
  /* Set fill color to a variable named shark */
  fill: var(--shark);
  /* Set width to 16 pixels */
  width: 16px;
  /* Set height to 16 pixels */
  height: 16px;
  /* Set fill transition duration to 0.3 seconds */
  transition: fill 0.3s;
}

/* Apply the same fill color and fill transition to the icon's SVG and path elements */
.bpw-header-icon svg,
.bpw-header-icon svg path {
  /* Set fill color to a variable named shark */
  fill: var(--shark);
  /* Set fill transition duration to 0.3 seconds */
  transition: fill 0.3s;
}

/* When the icon is hovered over, change the fill color to a variable named reef for the icon, SVG and path elements */
.bpw-header-icon:hover,
.bpw-header-icon:hover svg,
.bpw-header-icon:hover svg path {
  fill: var(--reef);
}
```

<br />

2. Styles the Header Title & Subtitle

```typescript
.bpw-header-title-flexbox {
    /* sets the overflow behavior of the element */
    overflow: hidden;
    /* sets the text overflow behavior of the element */
    text-overflow: ellipsis;
    /* sets the flexbox properties of the element for webkit browsers */
    -webkit-box-flex: 1;
    /* sets the flexbox properties of the element for Microsoft browsers */
    -ms-flex: 1 1 auto;
    /* sets the flexbox properties of the element */
    flex: 1 1 auto;
}

.bpw-header-title-container {
    /* sets the vertical alignment of the element */
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    /* sets the display of the element to use flexbox for webkit browsers */
    display: -webkit-box;
    /* sets the display of the element to use flexbox for Microsoft browsers */
    display: -ms-flexbox;
    /* sets the display of the element to use flexbox */
    display: flex;
}

.bpw-header-title-container .bpw-bot-avatar {
    /* sets the display of the element to none */
    display: none;
}

.bpw-header-title-container .bpw-bot-avatar svg {
    /* sets the zoom level of the element */
    zoom: 0.6;
}

.bpw-header-name {
    /* sets the font weight of the element */
    font-weight: 500;
    /* sets the font size of the element */
    font-size: 14px;
    /* sets the color of the element */
    color: var(--zinc-600);
}

.bpw-header-subtitle {
    /* sets the overflow behavior of the element */
    overflow: hidden;
    /* sets the white space handling of the element */
    white-space: nowrap;
    /* sets the text overflow behavior of the element */
    text-overflow: ellipsis;
    /* sets the font weight of the element */
    font-weight: 300;
    /* sets the font size of the element */
    font-size: 12px;
    /* sets the color of the element */
    color: var(--zinc-400);
}

.bpw-header-unread {
    /* sets the display of the element to none */
    display: none;
}

.sr-only {
    /* sets the position of the element to absolute */
    position: absolute;
    /* sets the width of the element */
    width: 1px;
    /* sets the height of the element */
    height: 1px;
    /* sets the padding of the element */
    padding: 0;
    /* sets the margin of the element */
    margin: -1px;
    /* sets the overflow behavior of the element */
    overflow: hidden;
    /* clips the element to the given rectangle */
    clip: rect(0, 0, 0, 0);
    /* sets the border of the element */
    border: 0;
}
```

<br />

3. Menu items. (Use these values in the init object)
<table>
     <tr>
       <td>**Customization Variable**</td>
       <td>**Variable type**</td>
       <td>**Default value**</td>
       <td>**Description**</td>
     </tr>
     <tr>
       <td>`showConversationsButton`</td>
       <td>boolean</td>
       <td>`true`</td>
       <td>If false, will hide the conversation list pane</td>
     </tr>
     <tr>
       <td>`enableTranscriptDownload`</td>
       <td>boolean</td>
       <td>`true`</td>
       <td>Allows the user to download the conversation history</td>
     </tr>
     <tr>
       <td>`enableConversationDeletion`</td>
       <td>boolean</td>
       <td>`false`</td>
       <td>Allows the user to delete its conversation history</td>
     </tr>
     <tr>
       <td>`showCloseButton`</td>
       <td>boolean</td>
       <td>`true`</td>
       <td>Display's the web chat close button when the web chat is opened</td>
     </tr>
   </table>