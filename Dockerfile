FROM registry.access.redhat.com/ubi8/ubi-minimal:latest

ARG PACKAGE_GITHUB_REGISTRY_TOKEN
ARG TZ=UTC
# specify the node base image with your desired version node:<version>

ENV PACKAGE_GITHUB_REGISTRY_TOKEN=${PACKAGE_GITHUB_REGISTRY_TOKEN}
ENV TZ=${TZ}


COPY --from=registry.access.redhat.com/ubi8/ubi:latest /usr/share/zoneinfo/UTC /usr/share/zoneinfo/UTC
COPY --from=registry.access.redhat.com/ubi8/ubi:latest /usr/share/zoneinfo/Europe/Berlin /usr/share/zoneinfo/Europe/Berlin

ENV HOME=/tmp \
    LC_ALL=C.UTF-8 \
    TZ=Europe/Berlin \
    NO_UPDATE_NOTIFIER=1 \
    JAVA_HOME="/usr/lib/jvm/jre" \
    JAVA_TOOL_OPTIONS="-Xmx1G" \
    MAVEN_HOME="/usr/share/maven" \
    NODE_OPTIONS="--max_old_space_size=1024"

WORKDIR /db2-cap-samples

RUN echo -e '[epel]\nname=Extra Packages for Enterprise Linux $releasever - $basearch\nmetalink=https://mirrors.fedoraproject.org/metalink?repo=epel-$releasever&arch=$basearch&infra=$infra&content=$contentdir\nenabled=0\ngpgcheck=1\ngpgkey=https://dl.fedoraproject.org/pub/epel/RPM-GPG-KEY-EPEL-8' > /etc/yum.repos.d/epel.repo \
    && microdnf update -y \
    && microdnf install --nodocs -y \
        git-core tar curl which sudo \
    && rm -rf \
      /var/cache/yum \
    && microdnf install --nodocs -y binutils \
    && microdnf clean all -y && rm -rf /var/cache/yum \
    && printf 'Defaults !requiretty\nALL ALL=NOPASSWD: ALL' >> /etc/sudoers.d/all \
    && chmod 440 /etc/sudoers.d/all \

# Install OpenJDK-11 (required for database adapter)
    && microdnf install --nodocs -y java-11-openjdk-devel \
    && microdnf clean all -y && rm -rf /var/cache/yum \

    && curl -sSf -L http://mirror.centos.org/centos/RPM-GPG-KEY-CentOS-Official -o /etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial \
    && echo -e '[nodejs]\nname=nodejs\nstream=\nprofiles=\nstate=disabled' > /etc/dnf/modules.d/nodejs.module \
    && echo -e '[centos-8-baseos]\nname=CentOS-$releasever - BaseOS\nbaseurl=http://mirror.centos.org/centos/$releasever-stream/BaseOS/$basearch/os/\ngpgcheck=1\npriority=99\nenabled=0\ngpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial' > /etc/yum.repos.d/centos-8-baseos.repo \
    && echo -e '[centos-8-appstream]\nname=CentOS-$releasever - AppStream\nbaseurl=http://mirror.centos.org/centos/$releasever-stream/AppStream/$basearch/os/\ngpgcheck=1\npriority=99\nenabled=0\ngpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial' > /etc/yum.repos.d/centos-8-appstream.repo \
    && echo -e '[nodesource]\nname=nodesource\nbaseurl=https://rpm.nodesource.com/pub_16.x/el/8/$basearch\nenabled=1\ngpgcheck=1\ngpgkey=https://rpm.nodesource.com/pub/el/NODESOURCE-GPG-SIGNING-KEY-EL' > /etc/yum.repos.d/nodesource.repo \
    && microdnf install --nodocs -y --enablerepo=nodesource \
        --enablerepo=centos-8-baseos --enablerepo=centos-8-appstream \
      gcc-c++ make nodejs \
    && microdnf clean all -y && rm -rf /var/cache/yum \


# Run a healtchcheck every 12 seconds, starting 120 seconds after boot
HEALTHCHECK --interval=12s --timeout=12s --start-period=120s \
 CMD node /db2-cap-samples/.aws/healthcheck.js

# Add runtime user
RUN useradd -d /db2-cap-samples -m -s /bin/bash samples



COPY . .

RUN chown -R samples /db2-cap-samples
RUN chown -R samples "/tmp/.npm"

USER samples

RUN rm -Rf .git || echo "Not found"
RUN rm -R .devcontainer || echo "Not found"
RUN rm -R .github || echo "Not found"
RUN rm -R .vscode || echo "Not found"
RUN rm -R docs || echo "Not found"
RUN rm -R test || echo "Not found"
RUN rm README.md || echo "Not found"
RUN rm .versionrc.js || echo "Not found"
RUN rm .editorconfig || echo "Not found"
RUN rm .gitignore || echo "Not found"
RUN rm .mocharc.js || echo "Not found"
RUN rm .npmrc || echo "Not found"
RUN rm .pre-commit-config.yml || echo "Not found"
RUN rm CHANGELOG.md || echo "Not found"
RUN rm cSpell.json || echo "Not found"
RUN rm package-lock.json || echo "Not found"


ENV PACKAGE_GITHUB_REGISTRY_TOKEN=xxx


ENV NODE_ENV=production
# your application's default port
EXPOSE 4004

CMD npm run start-container
