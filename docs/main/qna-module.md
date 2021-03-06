---
id: qna-module
title: Answering F.A.Q's
---

The QnA module is specifically designed to make handling frequently repeated questions as easy as possible. This module allows you to quickly add more responsiveness to your chatbot by enabling it to answer a user without creating an intent and a workflow. For your chatbot to understand a user's input, we need to add at least ten training phrases which are the different ways of asking the same question. To complete our QnA, we add at least one answer: plain text or any other content type. We can also redirect a user to a specific node and workflow as a response to the question. To achieve this, we first need to enable redirect.

![Adding a QnA](../assets/qna-overview.png)

## Create a context

To create context, you have two options:

- Create context-specific to a chatbot, create or edit this file `data/bots/<your_bot>/config/qna.json`.
- Create context-specific to all chatbots, create or edit this file `data/global/config/qna.json`.

Then append the name of your new contexts to `qnaCategories` as follows:

```json
{
  "$schema": "../../../assets/modules/qna/config.schema.json",
  "qnaCategories": "global,monkeys,giraffes"
}
```

Contexts listed in the dropdown menu are sourced from all your existing content (questions & NLU intents). The `qna.json` configuration file is no longer used to provide a list of contexts. To create a new context, open or add a Q&A, input the context in the **Contexts** field, then select **+ Create context**:

![New Context](../assets/faq-qna-new-context.png)

When you create a new context this way, you need to save your changes for the context to be persisted. 

## Add a QNA

Once you have created your contexts, you can create your QNAs and assign a context to them. From the `category` menu, choose one of your contexts:

![QnA Category](../assets/faq-qna-category.png)

## Add contexts to your flow

The final step is to set the desired context at the appropriate time in your flow. To help you with this, we added 3 actions (i.e. `appendContext`, `resetContext` and `removeContext`). You will find these actions under the NLU category in your actions list.

### Append Context

To set a context, let's use the `appendContext` action and add our new context in the `contexts` field. You can use comma-separated values to pass multiple contexts.

![Actions](../assets/faq-append-context.png)

### TTL

The TTL or Time-To-Live field is used to set a maximum number of interactions for this context to exists within a conversation.

Take `Welcome Bot` for instance. Its contexts have a TTL of `10`. This means that someone can ask up to 10 questions about animals before the context is ignored. After the TTL expires, the chatbot will fall back to the `global` context.
