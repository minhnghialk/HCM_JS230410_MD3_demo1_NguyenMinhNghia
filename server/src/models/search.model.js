import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const searchProducts = async (query, res) => {
  try {
    const searchResults = await prisma.products.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
    });

    console.log("Search results", searchResults);
    return searchResults;
  } catch (err) {
    console.log("err", err);
    return res.status(500).json({
      message: "Lỗi",
    });
  }
};

export default { searchProducts };
