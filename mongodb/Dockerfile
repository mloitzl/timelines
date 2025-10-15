FROM mongo:latest

# Copy the init script
COPY init-replica-set.sh /init-replica-set.sh
RUN chmod +x /init-replica-set.sh

# Set the entrypoint
ENTRYPOINT ["/bin/bash", "/init-replica-set.sh"]
