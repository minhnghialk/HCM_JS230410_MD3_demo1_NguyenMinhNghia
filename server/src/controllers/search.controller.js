import searchModel from "../models/search.model";

const searchProducts = async (req, res) => {
  const { query } = req.query;

  try {
    const searchResults = await searchModel.searchProducts(query);
    return res.status(200).json({ data: searchResults });
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({ message: "Lỗi" });
  }
};

export default { searchProducts };
