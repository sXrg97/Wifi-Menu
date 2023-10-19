import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    restaurantName: String,
    isLive: Boolean,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    categories: [{
        name: String,
        products: [{
            name: String,
            price: Number,
            description: String,
        }]
    }]
})

export const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);