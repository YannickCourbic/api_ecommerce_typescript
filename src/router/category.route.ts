import express , {Request ,Response} from 'express';
import slugify from 'slugify';
import CategoryService from '../service/CategoryService';
const router = express.Router();
const categoryService = new CategoryService();
import { authentification , isGranted } from '../security/authenticatedUser';
router.post("/create" , authentification , isGranted(["ROLE_SUPERADMIN", "ROLE_ADMIN"]), async (req:Request , res:Response) => {
  try {   
          return res.status(201).json({
            message: "vous avez crée avec succès une catégorie.",
            category: await categoryService.create({
              title: req.body.title,
              slug: slugify(req.body.title, {
                replacement: "-",
                lower: true,
                remove: /[*+~.()'"!:@]/g,
              }),
              description: req.body.description,
              logo: req.body.logo,
              updatedAt: null,
              parentId: req.body.parentId !== "" ? req.body.parentId : null,
            }),
          });
        } catch (error: any) {
          if(error.name === "SequelizeValidationError"){
              const validationsErrors = error.errors.map((err:any) => ({
                field: err.path,
                message: err.message
              }))
              res.status(400).json({message: "la création d'une catégorie a échouée" , error: validationsErrors});
          }
          else{
            res.status(500).json({message: "erreur de serveur" , error: error});
          }
        }
});

router.get("/all", async (req:Request , res:Response) => {
  try {
      return res.json({
        message: "Vous avez récupérée toute les catégories",
        categories: await categoryService.findAll(),
      });
  } catch (error) {
    return res.status(500).json({ message: "erreur de serveur", error: error });
  }

});


router.get("/:id" , async(req:Request , res:Response) => {
  try {
    const category = await categoryService.findById(parseInt(req.params.id));
    if(!category){
          return res.status(400).json({message: "vous n'avez pas récupérée une catégorie , l'id est invalide" , category: category});
    }
    return res.status(200).json({message: "vous avez récupérée une catégorie" , category: category});
  } catch (error) {
      return res.status(500).json({ message: "erreur de serveur", error: error });
  }
});

router.get("/slug/:slug" , async (req:Request, res:Response) => {
  try {
    const category = await categoryService.findByname(req.params.slug);
    if(!category){
                return res
                  .status(400)
                  .json({
                    message:
                      "vous n'avez pas récupérée une catégorie , le titre est invalide",
                    category: category,
                  });

    }
    return res.status(200).json({message: "vous avez récupérée une catégorie", category: category})
  } catch (error) {
          return res
            .status(500)
            .json({ message: "erreur de serveur", error: error });
  }
});


router.put("/update" , authentification , isGranted(["ROLE_ADMIN", "ROLE_SUPERADMIN"]), async(req:Request , res:Response) => {
  try {
    return res
    .status(200)
    .json({
      message: `vous avez modifiée avec succès la catégorie n° ${req.body.id}`,
      category : await categoryService.update(req.body)
    });
  } catch (error) {
     return res
       .status(500)
       .json({ message: "erreur de serveur", error: error });
  }
});


router.delete("/delete/:id" ,authentification , isGranted(['ROLE_ADMIN', 'ROLE_SUPERADMIN']), async(req:Request , res:Response) => {
  try {
    const category = await categoryService.findById(parseInt(req.params.id));
        if (!category) {
          return res
            .status(400)
            .json({
              message:`vous n'avez pas supprimer la catégorie n° ${req.params.id}, l'id est invalide`,
              category: category,
            });
        }
        if (category?.dataValues?.children.length === 0){
          return res.status(200).json({
            message: `vous avez supprimer avec succès la catégorie n° ${req.params.id}`,
            category: await categoryService.delete(parseInt(req.params.id))
          });
        }
        else{
          // console.log(category?.dataValues?.children);
          return res.status(200).json({
              message: `vous avez supprimer avec succès la catégorie n° ${req.params.id} et ses enfants sont devenus orphelins`,
              category: await categoryService.deleteCascade(parseInt(req.params.id))
          });
          
        }
        

  } catch (error:any) {
    return res
       .status(500)
       .json({ message: "erreur de serveur", error: error });
  }
})

module.exports = router;