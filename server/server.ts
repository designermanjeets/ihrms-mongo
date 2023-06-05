import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { blueBright, green, magentaBright, redBright } from 'chalk'
import { ApolloError, AuthenticationError } from 'apollo-server-core';
import { json } from 'body-parser';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose'
const { graphqlUploadExpress } = require('graphql-upload-ts');
const express = require('express')
const schema = require('./modules')
const config = require('./config')
const throng = require('throng')
const jwt = require('jsonwebtoken')

const mongodbURI = config.MONGODB_URI //process.env.MONGODB_URI
const dbName = 'ihrms_mongo_db'

export const connectDB = async (mongodbURI: string, dbName: string) => {
    
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    promiseLibrary: global.Promise
  }

  if (!mongodbURI || !dbName) {
    return Promise.reject('MongoDB URI or DB Name is not defined')
  }
  try {
    await mongoose.connect(mongodbURI, mongooseOptions, (error) => {
      if (error) {
        console.log(redBright(error))
      }
    })
    console.log(blueBright('🐣 mongodb database started'))
    // console.log(green(`🙉 dbURL `, mongodbURI))
    // console.log(green(`🙉 dbName `, dbName))
    return mongoose.connection
  } catch (error) {
    console.log(error)
    return undefined
  }
}

async function startApolloServer() {
  try {
    await connectDB(mongodbURI, dbName)

    const app = express()
    const httpServer = http.createServer(app)
    const server = new ApolloServer({
      schema: schema,
      csrfPrevention: true,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      uploads: false // disable apollo upload property
    } as any)

    await server.start();
    app.use(
        '/',
        cors(),
        json(),
        graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
        expressMiddleware(server, {
        context: async ({req}) => {
            const me = await Authorization(req);
                return {
                    me,
                    secret:config.JWT_SECRET,
                    tenantid: req.headers['tenantid']
                };
            },
        }),
    );

    await new Promise<void>((resolve) => httpServer.listen({ port: config.PORT }, resolve))

    console.log(magentaBright`🚀 Server ready at PORT:${config.PORT}/`)
  } catch (err: any) {
    throw new ApolloError(err)
  }
}


const Authorization = async (req: any) => {
    let token = req.headers['authorization']
    if(token) token = token.split(" ")[1];
    if (token) {
        try {
        // console.log(await jwt.verify(token, config.JWT_SECRET))
        return await jwt.verify(token, config.JWT_SECRET);//
        } catch (e) {
        throw new AuthenticationError(
            'JWT_EXPIRED',
        );
        }
    }
};

// const server = startApolloServer()
const server = throng({
    workers: config.WORKERS,
    lifetime: Infinity,
    start: startApolloServer
  });

export default server