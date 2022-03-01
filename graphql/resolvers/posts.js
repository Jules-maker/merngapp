const Post = require('../../models/Post')

module.exports = {

    Query: {

        async getPosts() {
            try {
                const posts = await Post.find();//find vide prends tout
                return posts;
            } catch (err) {
                throw new Error(err);
            }

        }
    }
}