const mongoose = require('mongoose');


module.exports = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("mongodb conected"))
        .catch((err) => console.error(err));
};