import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from 'graphql';

const user = new GraphQLObjectType({
  name: 'user_data',
  description: 'user Information',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: "The user's unique id",
    },
    name: {
      type: GraphQLString,
      description: "The user's name",
    },
    email: {
      type: GraphQLString,
      description: 'The email of the user',
    },
    token: {
      type: GraphQLString,
      description: "The user's login token",
    },
  })
});

export const userType = new GraphQLObjectType({
  name: 'user',
  description: 'user Information',
  fields: () => ({
    error: {
      type: GraphQLString,
      description: 'Error message if any',
    },
    user: {
      type: user,
      description: "The information on the user",
    },
  })
});


const bill = new GraphQLObjectType({
  name: 'recurrent_bills',
  description: 'reccurrent bill\'s information',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: "The bill's unique id",
    },
    userId: {
      type: GraphQLString,
      description: 'The unique id of the user',
    },
    description: {
      type: GraphQLString,
      description: "The information on the payment",
    },
    amount: {
      type: GraphQLString,
      description: "The recurrent amount being paid",
    }
  })
});

export const billType = new GraphQLObjectType({
  name: 'bills',
  description: 'bills Information',
  fields: () => ({
    error: {
      type: GraphQLString,
      description: 'Error message if any',
    },
    bills: {
      type: new GraphQLList(bill),
      description: "The details of a user's recurring payment'",
    }
  })
});


