const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        trim: true,
        ref: 'User'
    },
    jid: {
        type: String,
        trim: true,
        ref: 'Job'
    },
    orderType: {
        title: {
            type: String,
            required: true,
            trim: true
        },
        vehicle: {
            type: String,
            required: true,
            trim: true
        },
        deliveryDate: {
            type: String,
            required: true,
            trim: true
        },
        tripnumber: {
            type: Number,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        }
    },
    senderInfo: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: Number,
            required: true,
            trim: true
        },
        streetaddress: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        zipcode: {
            type: Number,
            required: true,
            trim: true
        }
    },
    receiverInfo: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: Number,
            required: true,
            trim: true
        },
        streetaddress: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        zipcode: {
            type: Number,
            required: true,
            trim: true
        }
    },
    orderItem:  {
        foodItem: {
            type: Number
        },
        woodenFurniture: {
            type: Number
        },
        electricalItem: {
            type: Number
        },
        glassFurniture: {
            type: Number
        },
        showPiece: {
            type: Number
        },
        itemDescription: {
            type: String
        },
        books: {
            type: Number
        },
        cost: {
            type: Number,
            required: true,
            trim: true
        }
    },
    locationInfo: {
        startPoint: {
            type: [Number],
            required: true,
        },
        endPoint: {
            type: [Number],
            required: true,
        }
    },
    assignedTo: {
        type: [String],
    }
})
const Task = mongoose.model('Task', taskSchema);

module.exports = Task