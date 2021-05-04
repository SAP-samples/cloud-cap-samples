#!/bin/bash


SUBDOMAIN=mtx-extend-bookshop
SAAS_HOST_SUFFIX="$(cf env multitenancy-approuter | grep TENANT_HOST_PATTERN | sed 's/.*(..)//' | sed 's/\..*//')"
SAAS_DOMAIN="$(cf env multitenancy-approuter | grep TENANT_HOST_PATTERN | sed 's/.*(..)//' | sed 's/[^.]*\.//')"

cf map-route multitenancy-approuter $SAAS_DOMAIN --hostname $SUBDOMAIN$SAAS_HOST_SUFFIX