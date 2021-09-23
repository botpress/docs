---
id: deploying
title: Building From Source
---
Botpress has added flexibility for developers who want access to the core codebase. You can clone Botpress from the source repository on Github, allowing you to test code, modules, and components more dynamically. 

## Compiling From Source
You can build Botpress from the [source repository](https://github.com/botpress/botpress) in a few simple steps. Doing this is useful when you need to create custom modules and components.

### Prerequisites

Install node version 12.18.1 for [your operating system](https://nodejs.org/download/release/v12.18.1/). **Tip:** on windows, download and use the .msi installer 

Install [Yarn package manager](https://yarnpkg.com/)

### Installation
While in the directory where you want to host your instance of Botpress, run the following commands in this sequence:

- `git clone git@github.com:botpress/botpress.git && cd botpress`
- `yarn cache clean` (proceed to the next step if this command fails)
- `yarn`
- `yarn build`
- `yarn start`

If you bumped into some errors during the execution of the `yarn build` command, you can try resetting your local repository:
1. Go to the [Releases](https://github.com/botpress/botpress/releases) page.
1. Click the commit associated with the latest release to open the commit page.
1. Copy the full commit hash.
1. Run this command with the copied commit hash: `git reset <copied hash>`.
1. Run `yarn build` again. 

> If you are in a hurry and cannot wait for a fix release, [clone the commit](https://coderwall.com/p/xyuoza/git-cloning-specific-commits) **(do not modify files one by one)**. 

## Ubuntu Systems 
You might run into issues while trying to build and start botpress via yarn on Rasberry Pi OS x64 or other Ubuntu Systems. Its ARM Architecture means none of the pre-built binaries will work. On trying to run the command `yarn start`, you might run into an error like the one below:

```bash
yarn start
yarn run v1.22.10
$ cd ./out/bp && cross-env NODE_PATH=./ cross-env BP_MODULES_PATH=./data/modules/:../../modules:../../internal-modules node index.js
Error starting botpress
Error: Could not require NativeExtension "crfsuite.node" for OS "linux debian_10".
	...
Could not require NativeExtension "crfsuite.node" for OS "linux debian_10".
	...
---STACK---
Error: Could not require NativeExtension "crfsuite.node" for OS "linux debian_10".
	...
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
``` 

To avoid this error, you can build native extensions for Ubuntu using the docker file below:

```dockerfile
FROM ubuntu:18.04
RUN apt update && apt install -y gnupg curl git build-essential cmake pkg-config
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
   apt install -y nodejs && \
   npm install -g yarn node-pre-gyp
RUN mkdir /build

WORKDIR /build/node-fasttext
RUN git clone https://github.com/botpress/node-fasttext.git .
RUN git submodule update --init && sh linux-build.sh && npm install && npm run-script build

WORKDIR /build/node-crfsuite
RUN git clone https://github.com/botpress/node-crfsuite.git .
RUN git submodule update --init && npm install && npm run-script build

WORKDIR /build/node-svm
RUN git clone https://github.com/botpress/node-svm.git .
RUN git submodule update --init && npm install && npm run-script build

WORKDIR /build/node-sentencepiece
RUN git clone https://github.com/botpress/node-sentencepiece.git .
RUN git submodule update --init && npm install && npm run-script build

CMD ["bash"]
```

Replicate this docker file using your distribution (e.g., Raspbian) and use it. After that, find the file with extension `*.node` for all libraries. 

To acess this file (with extension *.node), start a docker container with the image you just built.Thereafter, enter this container using the command
`docker run -it --rm --name <YOUR_IMG_NAME> bp-bindings`
Inside each of `/build/node-fasttext/*`,` /build/node-crfsuite/*`,` /build/node-svm/*` and `/build/node-sentencepiece/*` there should be a build/ or release/ directory where you’ll find a file with extension `*.node`.

If you’re running botpress from sources, the correct location would either be : `build/native-extensions/linux/default or create` the directory `build/native-extensions/linux/<your-distribution>`. You can look at the file rewire.ts 2 if you want to see how the important processes occur.

If you’re using the Botpress official binary, place the files in a directory named `bindings`.

After following the instructions above, you're good to go.