import productModel from "../models/product.model";
import { uploadFileToStorage } from "../meobase";
import fs from 'fs'
export default {
    create: async function(req, res) {
        try {
            req.body.category_id = Number(req.body.category_id);
            req.body.price = Number(req.body.price);
            let product_pictures = [];
            for (let i in req.files) {
                let url = await uploadFileToStorage(req.files[i], "products", fs.readFileSync(req.files[i].path));

                product_pictures.push(
                    {
                        url: url ? url : "https://firebasestorage.googleapis.com/v0/b/learnfirebase-2c8f7.appspot.com/o/db2ba0b3b0b32408778105d6be53a557_t.png?alt=media&token=fc4f08ac-a4fb-4998-874b-f997e29ee08e"
                    }
                )

                fs.unlink(req.files[i].path, (err) => {});
            }

            let modelRes = await productModel.create(req.body, product_pictures);

            return res.status(modelRes.status ? 200 : 213).json(modelRes);
        }catch(err) {
            return res.status(500).json({
                message: "Lỗi controllers!"
            });
        }
    },
    findMany: async function(req, res) {
        try {
            let modelRes = await productModel.findMany();
            return res.status(modelRes.status ? 200 : 213).json(modelRes);
        }catch(err) {
            return res.status(500).json({
                message: "Lỗi controllers!"
            });
        }
    },
    findById: async function(req, res) {
        try {
            let modelRes = await productModel.findById(req.params.product_id);
            return res.status(modelRes.status ? 200 : 213).json(modelRes);
        }catch(err) {
            return res.status(500).json({
                message: "Lỗi controllers!"
            });
        }
    }
}