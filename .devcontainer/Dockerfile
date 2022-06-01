# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.202.5/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 16, 14, 12, 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster
ARG VARIANT="16"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

ENV cicapBaseVersion="0.5.10"

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# Add the Google public key and package repository to your system
RUN sudo curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
RUN sudo bash -c "echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' >> /etc/apt/sources.list.d/google-chrome.list"

# Add the K6 public key and package repository to your system
RUN sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
RUN echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list

# Update your local package index
RUN sudo apt-get -y update

# Install chrome for UI tesing, k6 for load testing
RUN sudo apt-get install -y  google-chrome-stable k6 python3-pip software-properties-common

# Install JAVA
RUN sudo apt-get install default-jdk

# Add the Cloud Foundry Foundation public key and package repository to your system
# RUN wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | sudo apt-key add -
# RUN echo "deb https://packages.cloudfoundry.org/debian stable main" | sudo tee /etc/apt/sources.list.d/cloudfoundry-cli.list
# RUN sudo apt-get install -y cf8-cli
# Install Cloud Foundry CLI Plugins
# RUN cf install-plugin Targets -r CF-Community -f
# RUN cf install-plugin multiapps -r CF-Community -f

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# Install npm packages
RUN sudo -u node npm i -g @sap/cds-dk @sap/cds mbt yo standard sqlite3 @ui5/cli@next


# Install pre commit
RUN  pip3 install setuptools
RUN  pip3 install pre-commit

# Install fuck
RUN  pip3 install thefuck

# Install ansible
RUN pip3 install ansible

# Install boto
RUN pip3 install boto boto3
