import express , {Request,Response} from "express";
import MediaService from "../service/MediaService";
import { authentification, isGranted } from "../security/authenticatedUser";
const router = express.Router();
const mediaService = new MediaService();

router.post("/create" , authentification,isGranted(["ROLE_ADMIN", "ROLE_SUPERADMIN"]), async (req:Request , res:Response) => {
    
        req.body.medias.forEach(async (media : {id:number, src:string, type:string, productId:number|null}) => {
            try {
                await mediaService.create(media);
                return res.status(200).json({
                            message:
                            "Vous avez crée avec succès un ou plusieurs média",
                            medias: req.body.medias,
            });
            } catch (error:any) {
                    if (error.name === "SequelizeValidationError") {
                    const validationsErrors = error.errors.map((err: any) => ({
                        field: err.path,
                        message: err.message,
                    }));
                    return res.status(400).json({
                        message: "la création d'un média a échouée",
                        error: validationsErrors,
                    });
                    }
                    return res
                    .status(500)
                    .json({ message: "erreur de serveur", error: error });
            }
        });
});

router.get("/all" , async (req:Request , res:Response) => {
    try {
       const medias =  await mediaService.findAll();
        return res.status(200).json({message: "Vous avez récupérée tous les médias." , medias: medias})
    } catch (error) {
        return res
          .status(500)
          .json({ message: "erreur de serveur", error: error });
    }
});


router.get("/:id" , async(req:Request , res:Response) => {
    try {
        const media = await mediaService.findById(parseInt(req.params.id));
        if(!media) return res.status(400).json({message: "La récupération du média a échouée , l'identifiant est invalide."});
        return res.status(200).json({message: "Vous avez récupérer un pokémon avec succès." , media: media});
    } catch (error) {
         return res
           .status(500)
           .json({ message: "erreur de serveur", error: error });
    }
});

router.put("/update",authentification,isGranted(["ROLE_ADMIN", "ROLE_SUPERADMIN"]),
  async (req: Request, res: Response) => {
    try {
      const media = await mediaService.findById(parseInt(req.body.id));
      if (!media)
        return res.status(400).json({
          message:
            "Vous avez échouée à modifiée le média , l'identifiant ne correpond pas à un média, veuillez réessayez avec un id correct.",
        });
      const modify = await mediaService.update({
        id: req.body.id,
        src: req.body.src,
        type: req.body.type,
        productId: req.body.productId,
      });
      return res
        .status(200)
        .json({
          message: `Vous avez modifiée avec succès le média n° ${req.body.id}`,
          modify: modify,
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

router.delete("/delete/:id", authentification,isGranted(["ROLE_ADMIN", "ROLE_SUPERADMIN"]),
  async (req: Request, res: Response) => {
    try {
      const media = await mediaService.findById(parseInt(req.params.id));
      if (!media)
        return res
          .status(400)
          .json({
            message:
              "Vous avez échouée à supprimer ce média , l'identifiant est invalide.",
          });
      return res
        .status(200)
        .json({
          message: `Vous avez supprimer avec succès le média n° ${req.params.id}`,
          media: await mediaService.delete(parseInt(req.params.id)),
        });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "erreur de serveur", error: error });
    }
  }
);





module.exports = router;

