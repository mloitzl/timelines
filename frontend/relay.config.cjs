module.exports = {
  root: "./src",
  schema: "../backend/schema.graphql",
  eagerEsModules: true,
  language: "typescript",
  persistConfig: {
    file: "./persisted_queries.json",
    algorithm: "MD5",
  },
};
