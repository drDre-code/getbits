import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { graphqlHTTP } from 'express-graphql';
import schema from './model/graphql-schema';



const app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));






export default app;
