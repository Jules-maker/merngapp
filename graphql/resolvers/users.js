//args fait ref à registerInput: RegisterInput dans typeDefs
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET_KEY  } = require('../../config')
const User = require('../../models/User');

module.exports = {
    Mutation: {
        async register(
            _,
            { 
                registerInput: { username, email, password, confirmPassword }
            },
            context,
            info
            ) {
            //TODO: Validate user data
            //TODO: s'assurer que l'utilisateur n'existe pas déjà
            //TODO: hash le password et créer un token d'authentification
                password = await bcrypt.hash(password, 12);
                // on crée l'objet user
                const newUser = new User({
                    email,
                    username,
                    password,
                    createdAt: new Date().toISOString() /*toisostring convertie en string*/ 
                });

                const res = await newUser.save(); /*to the DB*/ 

                const token = jwt.sign({
                    id: res.id,
                    email: res.email,
                    username: res.username
                }, SECRET_KEY, { expiresIn: '1h'});

                return {
                    ...res._doc,
                    id: res._id,
                    token
                }
        }
    }
}