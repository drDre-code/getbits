import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { graphqlHTTP } from 'express-graphql';
import schema from './model/graphql-schema';
import dotenv from "dotenv";
dotenv.config()

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

app.listen(3000, () => console.log('listening on 3000'));




export default app;
