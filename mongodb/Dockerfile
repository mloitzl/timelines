# Use Debian slim as base (much smaller than mongo:latest, ~80MB vs ~700MB)
FROM debian:bookworm-slim

# Install dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        bash \
        openssl \
        curl \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Download and install mongosh (multi-arch support)
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        MONGOSH_ARCH="x64"; \
    elif [ "$ARCH" = "aarch64" ]; then \
        MONGOSH_ARCH="arm64"; \
    else \
        echo "Unsupported architecture: $ARCH" && exit 1; \
    fi && \
    curl -fsSL "https://downloads.mongodb.com/compass/mongosh-2.1.1-linux-${MONGOSH_ARCH}.tgz" -o mongosh.tgz && \
    tar -xzf mongosh.tgz && \
    mv mongosh-*/bin/mongosh /usr/local/bin/ && \
    rm -rf mongosh.tgz mongosh-*

# Copy the init script
COPY init-replica-set.sh /init-replica-set.sh
RUN chmod +x /init-replica-set.sh

# Set the entrypoint
ENTRYPOINT ["/bin/bash", "/init-replica-set.sh"]
