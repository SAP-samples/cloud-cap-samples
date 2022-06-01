# reCAP 2022

## Requirements

* Developer onboarding in seconds
* CI Pipeline with vulnerability scans and tests
* CD Pipeline
* OIDC, LDAP and Basic Authentication
* Podman Container Runtime
* IBM DB2 Database

## Solutions

* Github Codespaces as IDE
* Github Actions for CI/CD
* Hydra and openLDAP as OIDC and LDAP Provider
* AWS EC2 Instance as infrastructure

## Steps

1. EC2 Prerequisits: User & Credentials, add SSH Key, add security group
2. Create and configure an EC2 instance with ansible playbook
3. Configure reverse proxy and domain
4. Change the code
5. Check the CI Pipeline
6. Create a release and deploy
7. Check the application and smile (-;
