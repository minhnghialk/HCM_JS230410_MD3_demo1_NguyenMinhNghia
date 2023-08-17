import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  create: async function (product, product_pictures) {
    try {
      const result = await prisma.products.create({
        data: {
          ...product,
          product_pictures: {
            create: product_pictures,
          },
        },
        include: {
          product_pictures: true,
        },
      });

      return {
        status: true,
        message: "Thêm sản phẩm thành công!",
        data: result,
      };
    } catch (err) {
      // console.log("err", err)
      return {
        status: false,
        message: "Lỗi model!",
      };
    }
  },
  findMany: async function () {
    try {
      const result = await prisma.products.findMany({});

      return {
        status: true,
        message: "Lấy sản phẩm thành công!",
        data: result,
      };
    } catch (err) {
      // console.log("err", err)
      return {
        status: false,
        message: "Lỗi model!",
      };
    }
  },
  findById: async function (product_id) {
    try {
      const result = await prisma.products.findUnique({
        where: {
          id: Number(product_id),
        },
        include: {
          product_pictures: true,
        },
      });

      return {
        status: true,
        message: "Lấy thành công!",
        data: result,
      };
    } catch (err) {
      // console.log("err", err)
      return {
        status: false,
        message: "Lỗi model!",
      };
    }
  },
};
