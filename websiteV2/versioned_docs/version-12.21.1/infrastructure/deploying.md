---
id: deploying
title: Building From Source
original_id: deploying
---
Botpress has added flexibility for developers who want access to the core codebase. You can clone Botpress from the source repository on Github, allowing you to test code, modules, and components more dynamically. 

## Compiling From Source

You can build Botpress from the (source repository)[https://github.com/botpress/botpress] in a few simple steps. Doing this is useful when you need to create custom modules and components.

### Prerequisites

Install node version 12.18.1 for (your operating system)[https://nodejs.org/download/release/v12.18.1/]. **Tip:** on windows, download and use the .msi installer 

Install (Yarn package manager)[https://yarnpkg.com/]

### Installation

While in the directory where you want to host your instance of Botpress, run the following commands in this sequence:

-   git clone [git@github.com](mailto:git@github.com):botpress/botpress.git && cd ./botpress/ or git clone https: && cd ./botpress/
-   yarn cache clean (proceed to the next step if this command fails)
-   yarn
-   yarn build
-   yarn start

After following the instructions above, your command line should look as follows:

````bash



````

## Ubuntu Systems

You might run into issues while trying to build and start botpress via yarn on Rasberry Pi OS x64 or other Ubuntu Systems. Its ARM Architecture means none of the pre-built binaries will work. On trying to run the command ``, you might run into an error like the one below:

```bash



```

To avoid this error, you can build native extensions for Ubuntu using the docker file below:

```dockerfile



```

Replicate this docker file using your distribution (e.g., Raspbian) and use it. After that, find the file with extension `` for all libraries. 

To acess this file (with extension _.node), start a docker container with the image you just built.Thereafter, enter this container using the command
``
Inside each of \`/build/node-fasttext/_`` /build/node-crfsuite/_`` /build/node-svm/_``/build/node-sentencepiece/_``_.node\`.

If you’re running botpress from sources, the correct location would either be : `` the directory ``. You can look at the file rewire.ts 2 if you want to see how the important processes occur.

If you’re using the Botpress official binary, place the files in a directory named ``.
