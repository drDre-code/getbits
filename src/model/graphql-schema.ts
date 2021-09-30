import { loginUser, registerUser } from '../controller/userController';
import { getBills, editBill, uploadBill, deleteBill } from '../controller/billsController';
import { userType, billType } from './types';
import { isAuth } from '../utils';
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';




const query = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query',
  fields: () => ({
    signIn: {
      type: userType,
      description: 'Enter the login information of the user as argument',
      args: {
        email: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The email of the user',
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The password of the user',
        }
      },
      resolve: (_, args) => loginUser(args.email, args.password)
    },
    bills: {
      type: billType,
      description: 'The list of recurrent bills by a user',
      resolve: (_, _args, next) => {
        const user = isAuth(next) as unknown as { [key: string]: string; };
        if (user.message) {
          return { message: user.message };
        }
        return getBills(user.id);
      }
    }
  })
});

const mutation = new GraphQLObjectType({
  name: 'mutation',
  description: 'Changes you can make',
  fields: () => ({
    createUser: {
      type: userType,
      description: 'creates a todo',
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The email of the user',
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The email of the user',
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The password of the user',
        }
      },
      resolve: (_, args) => registerUser(args.name, args.email, args.password)
    },
    uploadBill: {
      type: billType,
      description: 'creates a todo',
      args: {
        description: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The information on the payment',
        },
        amount: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The recurrent amount being paid',
        }
      },
      resolve: (_, args, next) => {
        const user = isAuth(next) as unknown as { [key: string]: string; };
        if (user.message) {
          const message = user.message;
          return { message };
        }
        return uploadBill(user.id, args.description, args.amount);
      }
    },
    editBill: {
      type: billType,
      description: 'makes changes to the specific bill whose Id is passed',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: "The bill's unique id",
        },
        description: {
          type: GraphQLString,
          description: 'The information on the payment',
        },
        amount: {
          type: GraphQLString,
          description: 'The recurrent amount being paid',
        }
      },
      resolve: (_, args, next) => {
        const user = isAuth(next) as unknown as { [key: string]: string; };
        if (user.message) {
          const message = user.message;
          return { message };
        }
        return editBill(user.id, args.id, args.description, args.amount);
      }
    },
    deleteBill: {
      type: new GraphQLObjectType({
        name: 'delete_bill',
        description: 'delete bills',
        fields: () => ({
          error: {
            type: GraphQLString,
            description: 'Error message if any',
          },
          success: {
            type: GraphQLString,
            description: 'Error message if any',
          }
        })
      }),
      description: 'creates a todo',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The email of the user',
        }
      },
      resolve: (_, args, next) => {
        const user = isAuth(next) as unknown as { [key: string]: string; };
        if (user.message) {
          return { error: user.message };
        }
        return deleteBill(user.id, args.id);
      }
    },

  })
});



const Schema = new GraphQLSchema({
  query,
  mutation
});


export = Schema;
