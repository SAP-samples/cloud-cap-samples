#!/usr/bin/env bash
npm ci

cp .devcontainer/.bash_aliases ~/.bash_aliases

# # Configure the GIT merge strategy
git config --global pull.rebase false


# # Initialize pre commit and fuck
fuck
fuck
pre-commit install
pre-commit

echo $ID_RSA > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
