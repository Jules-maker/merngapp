const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { MONGODB } = require('./config.js');



const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected');
        return server.listen({ port: 5000 });
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    })
/* const token = generateToken(user) on genere un token pour user 

 if (user) {
                /*On pourrait utiliser throw err mais on peut générer un type d'erreur interprété par graphql
                throw new UserInputError('Username is taken', {
                    errors: { /*username = key 
                        username: 'This username is taken'
                    }
                })
            }*/
            /*const res = await newUser.save();to the DB*/