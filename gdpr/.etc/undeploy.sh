cf delete gdpr-srv -f
cf delete gdpr-db-deployer -f
cf delete-service gdpr-pdm -f
cf delete-service gdpr-auditlog -f
cf delete-service gdpr-uaa -f
cf delete-service gdpr-hdi -f
cf delete-service gdpr-logs -f
