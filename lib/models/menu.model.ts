import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    restaurantName: String,
    slug: { type: String, unique: true },
    isLive: Boolean,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    lifetimeViews: Number,
    menuPreviewImage: String,
    categories: [{
        name: String,
        products: [{
            name: String,
            price: Number,
            description: String,
            image: String,
            isReduced: Boolean,
            reducedPrice: Number,
            isDiscountProcentual: Boolean,
            _id: mongoose.Schema.Types.ObjectId,
        }]
    }]
})

menuSchema.index({ slug: 1 }, { unique: true });

export const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);