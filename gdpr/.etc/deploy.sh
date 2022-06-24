npm run build
cf create-service-push
cf bind-service gdpr-srv gdpr-pdm -c .pdm/pdm-binding-config.json
cf restage gdpr-srv
