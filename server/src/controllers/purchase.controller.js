import purchaseModel from "../models/purchase.model";


export default {
    addToCart: async function(req, res) {
        try {
            req.body.quantity = Number(req.body.quantity);
            req.body.product_id = Number(req.body.product_id);
            let modelRes = await purchaseModel.addToCart(Number(req.params.user_id), req.body);
            return res.status(modelRes.status ? 200 : 213).json(modelRes)
        }catch(err) {
            return res.status(500).json({
                message: "Lỗi controller!"
            })
        }
    },
    findCart: async function(req, res) {
        try {
            let modelRes = await purchaseModel.findCart(Number(req.params.user_id));
            return res.status(modelRes.status ? 200 : 213).json(modelRes)
        }catch(err) {
            return res.status(500).json({
                message: "Lỗi controller!"
            })
        }
    }
}