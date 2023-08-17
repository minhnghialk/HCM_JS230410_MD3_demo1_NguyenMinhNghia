import express from "express";
const router = express.Router();

import searchController from "../../controllers/search.controller";

router.get("/", searchController.searchProducts);

export default router;
