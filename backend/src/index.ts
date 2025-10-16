import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers";
import GraphQLJSON from "graphql-type-json";
import { startDeviceStateWatcher } from "./deviceStateWatcher";
import { startDehumidifierRunWatcher } from "./dehumidifierRunWatcher";
import { readFileSync } from "fs";
import { join } from "path";

// Load GraphQL schema from file
const typeDefs = readFileSync(join(__dirname, "../schema.graphql"), "utf8");

async function startServer() {
  // Connect to MongoDB
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/timelines?authSource=admin";
    const mongoUser = process.env.MONGODB_USER;
    const mongoPass = process.env.MONGODB_PASS;
    const mongooseOptions: any = {};
    if (mongoUser && mongoPass) {
      mongooseOptions.user = mongoUser;
      mongooseOptions.pass = mongoPass;
    }
    await mongoose.connect(mongoUri, mongooseOptions);
    console.log("Connected to MongoDB at", mongoUri);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }

  const app = express();
  const httpServer = createServer(app);

  // Create the schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: {
      JSON: GraphQLJSON,
      ...resolvers,
    },
  });

  // Create WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(cors());
  app.use(express.json());
  app.use("/graphql", expressMiddleware(server));

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/graphql`);
    console.log(`WebSocket is running at ws://localhost:${PORT}/graphql`);
  });

  // Start watching device state changes for GraphQL subscriptions
  startDeviceStateWatcher();
  startDehumidifierRunWatcher();
}

startServer();
