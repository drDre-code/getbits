import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';

const user = new GraphQLObjectType({
  name: 'user_data',
  description: 'user Information',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: "The user's unique id",
      resolve: (source) => source._id
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
    data: {
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
      resolve: (source) => source._id
    },
    userId: {
      type: GraphQLString,
      description: 'The unique id of the user',
    },
    details: {
      type: GraphQLString,
      description: "The information on the payment",
    },
    amount: {
      type: GraphQLFloat,
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
    data: {
      type: new GraphQLList(bill) || bill,
      description: "The details of a user's recurring payment'",
    }
  })
});


