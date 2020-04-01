const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://houtarou:yannyann1234@mercury-database-6i8wo.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
})
//mongodb://127.0.0.1:27017/mercury-api