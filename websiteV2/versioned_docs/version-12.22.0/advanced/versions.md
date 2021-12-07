---
id: versions
title: Version Control
original_id: versions
---
## Overview

Once your bot is deployed, the good part is that you (and non-technical team members) **can still make changes to your bots from Botpress Studio**. This is one major advantage of using Botpress. This is made possible by our built-in versioning system.

For your convenience Botpress provides the GUI tools to edit these files while in development. We also provide the same tools in production, but there's a caveat. Writing changes to the server's file system is not always possible, they could easily be lost due to ephemeral filesystems or they could be ignored when running in a cluster setup.

To address this issue, we added commands to the cli. In production, your changes are saved to the database which is persisted between deployments. Botpress cli gives you two commands: `bp pull` to pull pending changes on your server for all your bots and server wide files and `bp push` to push your local changes to your server.

You can also head to the versioning tab of your botpress admin panel at https:, the command will be properly formatted for you (including your token) any changes have been made. Just paste it to your shell and the changes will be extracted in the provided target directory. A successful output should look like the following:

![versioning pull](assets/versioning-pull.png)

Notice that without any changes, you will see a **You're all set!** message.

## CLI Commands

&gt; **Note:** The `` environment variable must be set to `` to enable **pushing** to this node.

Please note that `` and `` uses relative paths:

### Pull

**Binary:**

```bash



```

**Docker:**

```bash



```

### Push

**Binary:**

```bash



```

**Docker:**

```bash



```
