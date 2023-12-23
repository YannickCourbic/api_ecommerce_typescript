import express, { Request, Response } from "express";
import slugify from "slugify";
import ProductService from "../service/ProductService";
import MediaService from "../service/MediaService";
import Product from "../model/Product";
import Media from "../model/Media";
import Category from "../model/Category";
import { authentification , isGranted } from "../security/authenticatedUser";
const router = express.Router();
const productService = new ProductService();
const mediaService = new MediaService();
router.post("/create",authentification,isGranted(["ROLE_ADMIN", "ROLE_SUPERADMIN"]),
  async (req: Request, res: Response) => {
    try {
      return res.status(200).json({
        message: "vous avez crée avec succès un produit.",
        product: await productService.create({
          name: req.body.name,
          slug: slugify(req.body.name, {
            replacement: "-",
            lower: true,
            remove: /[*+~.()'"!:@]/g,
          }),
          status: req.body.status,
          price: parseFloat(req.body.price),
          stock: parseInt(req.body.stock),
          tva: parseInt(req.body.tva),
          categoryId: parseInt(req.body.categoryId),
        }),
      });
    } catch (error: any) {
      if (error.name === "SequelizeValidationError") {
        const validationsErrors = error.errors.map((err: any) => ({
          field: err.path,
          message: err.message,
        }));
        return res.status(400).json({
          message: "la création d'une catégorie a échouée",
          error: validationsErrors,
        });
      }
      return res
        .status(500)
        .json({ message: "erreur de serveur", error: error });
    }
  }
);

router.get("/all", async (req: Request, res: Response) => {
  try {
    if (req.query.slug) {
      const product = await productService.findBySlug(req.query.slug as string);
      if (!product)
        return res
          .status(400)
          .json({
            message: "Récupération du produit échouée",
            product: product,
          });
      const medias = await mediaService.findAllByProduct(product.id);
      return res
        .status(200)
        .json({
          message: "Vous avez récupéré un produit.",
          product: product,
          medias: medias,
        });
    }

    if (req.query.search) {
      const product = await productService.search(
        req.query.search as string,
        parseInt(req.query.limit as string)
      );
      if (!product)
        return res
          .status(400)
          .json({
            message: "Récupération du produit échouée",
            product: product,
          });
      // const medias = await mediaService.findAllByProduct(product!.id)
      return res
        .status(200)
        .json({
          message: "Vous avez recherché un ou plusieurs produits avec succès.",
          product: product,
        });
    }

    const products = await productService.findAll();
    // Use Promise.all to wait for all media fetch operations to complete
    return res
      .status(200)
      .json({
        message: "Vous avez récupéré tous les produits avec succès.",
        products: products,
      });
  } catch (error) {
    return res.status(500).json({ message: "Erreur de serveur", error: error });
  }
});

router.get("/allMedias", async (req: Request, res: Response) => {
  try {
    const products: Product[] | null = await productService.findAll();
    const productsSerialize: {
      id?: number;
      name?: string;
      slug?: string;
      status?: string;
      price?: number;
      stock?: number;
      tva?: number;
      categoryId?: number;
      catgeory?: Category;
      medias?: Media[] | null;
    }[] = await Promise.all(
      (products || []).map(async (product: Product) => {
        const mediaList = await mediaService.findAllByProduct(
          product.getDataValue("id")
        );
        return {
          id: product.getDataValue("id"),
          name: product.getDataValue("name"),
          slug: product.getDataValue("slug"),
          status: product.getDataValue("status"),
          price: product.getDataValue("price"),
          stock: product.getDataValue("stock"),
          tva: product.getDataValue("tva"),
          catgeory: product.getDataValue("Category"),
          medias: mediaList,
        };
      })
    );
    return res.status(200).json({
      message: "Vous avez récupéré tous les produits associés à des médias",
      products: productsSerialize,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des produits", error);
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des produits",
    });
  }
});

router.get("/:id" , async(req:Request , res:Response) => {
  try {
    const product = await productService.findById(parseInt(req.params.id));
    if(!product) return res.status(400).json({message:"récupération du produit échouée, veuillez réessayez avec un identifiant correct."});
    const media = await mediaService.findAllByProduct(product.id);
    return res.status(200).json({message: "vous avez récupérée un produit." , product: product , media : media})
  } catch (error) {
          return res
            .status(500)
            .json({ message: "erreur de serveur", error: error });
  }
});

router.get("/name/:name", async(req:Request, res:Response) => {
  try {
    const product = await productService.findByName(req.params.name);
    if(!product) return res
      .status(400)
      .json({
        message:
          "récupération du produit échouée, veuillez réessayez avec un nom de produit correct.",
      });
      return res.status(200).json({message: "Vous avez récupérée le produit avec succès." , product: product})
  } catch (error) {
    return res.status(500).json({ message: "erreur de serveur", error: error });
  }
});

router.put( "/update",authentification,isGranted(["ROLE_ADMIN", "ROLE_SUPERADMIN"]),
  async (req: Request, res: Response) => {
    try {
      const modify = await productService.update({
        id: req.body.id,
        name: req.body.name,
        slug: slugify(req.body.name, {
          replacement: "-",
          lower: true,
          remove: /[*+~.()'"!:@]/g,
        }),
        status: req.body.status,
        price: req.body.price,
        stock: req.body.stock,
        tva: req.body.tva,
        categoryId: req.body.categoryId,
      });
      if (!modify)
        return res
          .status(400)
          .json({ message: `La modification du produit n° ${req.body.id}` });

      return res
        .status(200)
        .json({
          message: `Vous avez modifiée avec succès le produit n° ${req.body.id}`,
          product: modify,
        });
    } catch (error: any) {
      if (error.name === "SequelizeValidationError") {
        const validationsErrors = error.errors.map((err: any) => ({
          field: err.path,
          message: err.message,
        }));
        return res.status(400).json({
          message: `la modification du produit n° ${req.body.id} a échouée..`,
          error: validationsErrors,
        });
      }
      return res
        .status(500)
        .json({ message: "erreur de serveur", error: error });
    }
  }
);

router.delete("/delete/:id" ,authentification, isGranted(["ROLE_ADMIN", "ROLE_SUPERADMIN"]) ,async (req:Request , res:Response) => {
  try {
    const product = await productService.findById(parseInt(req.params.id));
    if(!product) return res.status(400).json({message: `la suppression du produit n° ${req.params.id} a échouée, l'identifiant est invalide.`});
    return res.status(200).json({message: `Vous avez supprimée avec succès le produit n° ${req.params.id}.` , product: await productService.delete(parseInt(req.params.id))})
    
  } catch (error) {
        return res
          .status(500)
          .json({ message: "erreur de serveur", error: error });
  }
});





module.exports = router;