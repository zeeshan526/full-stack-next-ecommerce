import { model, Schema } from "mongoose"

const ProductSchema = new Schema({
    tile:{type:string, required:true},
    description:string,
    price:{type:string, required:true},
})

export const Product = model('product',ProductSchema)