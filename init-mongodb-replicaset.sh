#!/bin/bash
# Standalone script to initialize MongoDB replica set
# Can be run manually with: ./init-mongodb-replicaset.sh

set -e

echo "Initializing MongoDB replica set..."
echo "Make sure MongoDB container is running (docker compose up mongodb -d)"
echo ""

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

MONGODB_USER=${MONGODB_USER:-admin}
MONGODB_PASS=${MONGODB_PASS:-yourpassword}

docker compose exec mongodb mongosh \
  --username "$MONGODB_USER" \
  --password "$MONGODB_PASS" \
  --authenticationDatabase admin \
  --eval "
    try {
      var status = rs.status();
      if (status.ok === 1) {
        print('✓ Replica set already initialized');
        print('Current status:');
        printjson(status.members);
      }
    } catch(e) {
      print('Initializing replica set rs0...');
      var result = rs.initiate({
        _id: 'rs0',
        members: [{_id: 0, host: 'mongodb:27017'}]
      });
      printjson(result);
      if (result.ok === 1) {
        print('✓ Replica set initialized successfully');
      } else {
        print('✗ Failed to initialize replica set');
        exit(1);
      }
    }
  "

echo ""
echo "Done! You can now connect to MongoDB with:"
echo "mongodb://$MONGODB_USER:$MONGODB_PASS@localhost:27017/timelines?authSource=admin&directConnection=true"

