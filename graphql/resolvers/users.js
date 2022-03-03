//args fait ref à registerInput: RegisterInput dans typeDefs
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
const { SECRET_KEY } = require('../../config')
const User = require('../../models/User');

function generateToken(user){
    return jwt.sign({
        id: res.id,
        email: res.email,
        username: res.username
    }, 
    SECRET_KEY, { expiresIn: '1h' });

   
}

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valide } = validateLoginInput(username, password);
            const user = await User.findOne({ username });

            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }
            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', { errors });
            }

            const token = generateToken(user); /* on genere un token pour user */
        },
        async register(
            _,
            {
                registerInput: { username, email, password, confirmPassword }
            },

        ) {
            //TODO: Validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            // s'assurer que l'utilisateur n'existe pas déjà
            const user = await User.findOne({ username });
            if (user) {
                /*On pourrait utiliser throw err mais on peut générer un type d'erreur interprété par graphql*/
                throw new UserInputError('Username is taken', {
                    errors: { /*username = key */
                        username: 'This username is taken'
                    }
                })
            }
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

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}