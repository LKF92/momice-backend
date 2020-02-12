const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("../prisma/generated/prisma-client");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Event = require("./resolvers/Event");
const Attendee = require("./resolvers/Attendee");

const resolvers = {
  Query,
  Mutation,
  User,
  Event,
  Attendee
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  // We attach the prisma client to the context in order to be able to use prisma's built-in CRUD functions in our resolvers (would also be used for authentication if we'd needed to)
  context: { prisma }
});
server.start(() => console.log(`Server is up ! Running on http://localhost:4000`));
