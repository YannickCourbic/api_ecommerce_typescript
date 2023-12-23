import express , {Request , Response} from "express";
import UserService from "../service/UserService";
import { authentification  , isGranted , generateToken ,transporteur} from "../security/authenticatedUser";
import nodemailer from "nodemailer";
const bcrypt = require("bcrypt");
const router = express.Router();
const userService = new UserService();

router.post("/create", async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const token = generateToken(req.body.username as string);
    const activationLink = `http://localhost:${process.env.PORT}/api/v1/ecommerce/security/activate?token=${token}`;

    const mailOptions = {
      from: "a.yacine2023@gmail.com",
      to: req.body.email,
      subject: "Activation de votre compte",
      text: `Veuillez cliquer sur le lien pour activer votre compte : ${activationLink}`,
    };

    // Utilisation de promesse pour sendMail
    await new Promise<void>((resolve, reject) => {
      transporteur.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve();
        }
      });
    });

    const user = await userService.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      roles: ["ROLE_USER"],
      isActive: false,
    });

    return res.status(201).json({
      message:
        "Vous vous êtes enregistré avec succès. Le mail d'activation a été envoyé sur votre boîte mail. Veuillez cliquer sur le lien pour pouvoir activer votre compte.",
      user: user,
    });
  } catch (error: any) {
    if (error.name === "SequelizeValidationError") {
      const validationsErrors = error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        message: "La création d'un utilisateur a échoué",
        error: validationsErrors,
      });
    } else {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erreur de serveur", error: error });
    }
  }
});


router.get("/all" , authentification , isGranted(['ROLE_SUPERADMIN']), async (req:Request , res:Response) => {
    try {
        return res.status(200).json({
            message:"Vous avez récupérée la liste d'utilisateur",
            users: await userService.findAll()
        })
    } catch (error) {
          return res.status(500).json({ message: "erreur de serveur", error: error });
    }
});

router.get("/:id",authentification, isGranted(["ROLE_USER , ROLE_SUPERADMIN"]), async(req:Request, res:Response) => {
    try {
        const user = await userService.findById(parseInt(req.params.id));
        if(!user) res.status(400).json({message:"La récupération de l'utilisateur a échouée , l'identifiant est invalide"})
        return res.status(200).json({
            message: `vous avez récupérer le user n° ${req.params.id}`,
            user: user
        })
    } catch (error) {
        res
        .status(500)
        .json({ message: "erreur de serveur", error: error });
    }
});



// router.put("/update", authentification , isGranted(["ROLE_USER"]),async (req:Request, res:Response) => {
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         const modify = await userService.update({
//             id: req.body.id,
//             firstname: req.body.firstname,
//             lastname: req.body.lastname,
//             username: req.body.username,
//             email: req.body.email,
//             password: hashedPassword,
//             roles: req.body.roles,
//             status: req.body.status,
//         });
//         if (!modify)
//             return res
//                 .status(400)
//                 .json({ message: `La modification de l'utilisateur n° ${req.body.id} a échouée.` });
            
//                 return res
//                 .status(200)
//                 .json({
//                     message: `Vous avez modifiée avec succès le produit n° ${req.body.id}`,
//                     product: modify,
//                 });
//     } catch (error:any) {
//             if (error.name === "SequelizeValidationError") {
//             const validationsErrors = error.errors.map((err: any) => ({
//             field: err.path,
//             message: err.message,
//             }));
//             return res.status(400).json({
//             message: `la modification du produit n° ${req.body.id} a échouée..`,
//             error: validationsErrors,
//             });
//         }
//             return res
//             .status(500)
//             .json({ message: "erreur de serveur", error: error });
//         }
// });

router.delete("/delete/:id" , authentification , isGranted(['ROLE_USER']),  async (req:Request , res:Response) => {
    try {
        const user = await userService.findById(parseInt(req.params.id));
        if(!user)return res
          .status(400)
          .json({
            message: `la suppression de l'utilisateur n° ${req.params.id} a échouée, l'identifiant est invalide.`,
          });
                return res.status(200).json({
                    message: `l'utilisateur n°${req.params.id} a été supprimée avec succès.`,
                    user: await userService.delete(parseInt(req.params.id)),
                });
    } catch (error) {
        return res
        .status(500)
        .json({ message: "erreur de serveur", error: error });
    }
});

module.exports = router;