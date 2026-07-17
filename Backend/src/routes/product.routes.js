import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import {
  createProduct,
  updateProduct,
  removeProductImage,
  getAllProducts,
  getSellerProducts,
  getProductDetails,
  addProductVariant,
  updateVariant,
  deleteVariant,
  searchProducts,
} from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const router = Router();

/*
@route POST /api/products
@desc Create a new product
@access Private (Seller only)
*/
router.post(
  "/",
  authenticateSeller,
  upload.array("images", 7),
  createProductValidator,
  createProduct,
);

/*
@route PATCH /api/products/:id
@desc Update an existing product (base fields and append images)
@access Private (Seller only)
*/
router.patch(
  "/:id",
  authenticateSeller,
  upload.array("images", 7),
  updateProduct,
);

/*
@route DELETE /api/products/:id/image
@desc Remove a specific image from a product
@access Private (Seller only)
*/
router.delete("/:id/image", authenticateSeller, removeProductImage);

/*
@route GET /api/products/seller
@desc Get all products of the authenticated seller
@access Private (Seller only)
*/
router.get("/seller", authenticateSeller, getSellerProducts);

/*
@route GET /api/products
@desc Get all products
@access Public
*/
router.get("/", getAllProducts);


/*
@route GET /api/products/search
@desc Search products by name
@access Public
*/
router.get("/search", searchProducts);

/*
@route GET /api/products/detail/:id
@desc Get product details by ID
@access Public
*/
router.get("/detail/:id", getProductDetails);

/*
@route POST /api/products/:id/variants
@desc Add a new variant to an existing product
@access Private (Seller only)
*/
router.post(
  "/:id/variants",
  authenticateSeller,
  upload.array("images", 7),
  // createProductValidator,
  addProductVariant,
);

/*
@route PATCH /api/products/:id/variant/:variantId
@desc Update a variant of an existing product
@access Private (Seller only)
*/
router.patch("/:id/variant/:variantId", authenticateSeller, updateVariant);

/*
@route DELETE /api/products/:id/variant/:variantId
@desc Delete a variant of an existing product
@access Private (Seller only)
*/
router.delete("/:id/variant/:variantId", authenticateSeller, deleteVariant);

export default router;
