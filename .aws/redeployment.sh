#! /bin/bash

echo "version: $1";

export TMPDIR=/home/ubuntu/tmp

echo "login to ghcr.io"
podman login ghcr.io --authfile=/home/ubuntu/auth.json

redeploy_container()
{
  VERSION=$1

  echo "Pull image ghcr.io/quadrio/db2-cap-samples:${VERSION}"
  podman pull ghcr.io/quadrio/db2-cap-samples:$VERSION --authfile=/home/ubuntu/auth.json

  echo "Stop containter CAP-SAMPLES"
  podman stop CAP-SAMPLES

  echo "Remove containter CAP-SAMPLES"
  podman rm CAP-SAMPLES

  echo "Start containter CAP-SAMPLES"
  podman run -d -p 8080:4004 --restart=on-failure:10 --name=CAP-SAMPLES \
    --volume /home/ubuntu/tmp/.cdsrc.json:/db2-cap-samples/.cdsrc-private.json \
    ghcr.io/quadrio/db2-cap-samples:$VERSION
}

redeploy_container $1

echo "Prune system"
podman system prune -a -f --filter "until=2h"
