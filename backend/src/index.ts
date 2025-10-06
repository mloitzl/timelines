import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { resolvers } from "./resolvers";

const typeDefs = `
  type Event {
    id: ID!
    eventType: String!
    timestamp: String!
    payload: String
  }
  type Query {
    events: [Event!]!
  }
  type Mutation {
    ingestEvent(eventType: String!, payload: String): Event!
  }
`;

async function startServer() {
  // Connect to MongoDB
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/timelines";
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
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(cors());
  app.use(express.json());
  app.use("/graphql", expressMiddleware(server));

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/graphql`);
  });
}

startServer();
