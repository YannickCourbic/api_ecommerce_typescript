import express , {Request , Response} from "express";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");
const secretKey = process.env.SECRET as string || "8s24Sc6dGnp2MCxQQ2p5";
import UserService from "../service/UserService";
const userService = new UserService();
const {
  createTokenAndVerifyEmailOrUsername,
  authentification,
  isGranted,
} = require("../security/authenticatedUser");
const router = express.Router();
router.post("/login"  , createTokenAndVerifyEmailOrUsername,  async (req:any, res:Response) => {
  
});


router.get("/profil", authentification , isGranted(["ROLE_USER"]), (req:any , res:Response) => {
    return res.status(200).json({message: `Bienvenue sur votre profil ${req.session.user.username}` , user: req.session.user });
});

router.post("/logout", authentification , isGranted(["ROLE_USER"]) , (req:any , res:Response) => {
    req.session.destroy((err:any) => {
      if(err){
        return res.status(500).json({ message: "Erreur de serveur" });
      }
      return res.status(200).json({message: "Déconnexion réussie"});
    });
});

router.get("/activate", async (req: Request, res: Response) => {
  try {
    // je récupère le token depuis le lien
    const token = req.query.token as string;

    // si le token n'existe pas
    if (!token)
      return res
        .status(401)
        .json({ message: "Erreur de validation du token." });

    // je décode le token pour obtenir le username
    const decoded: any = jwt.verify(token, secretKey);

    // je récupère l'utilisateur par le username
    const user = await userService.findEmailOrUsername(
      decoded.data as string
    );

    // si l'utilisateur n'existe pas
    if (!user)
      return res.status(404).json({ message: "Le token est invalide." });

    // mise à jour du statut isActive de l'utilisateur
    await user.update({ isActive: true });

    // renvoie une réponse réussie
    res
      .status(200)
      .json({ message: "Vous avez activé le compte avec succès." });
  } catch (error: any) {
    console.error(error); // loggez l'erreur pour la déboguer

    // renvoie une réponse d'erreur avec le message d'erreur
    res
      .status(500)
      .json({
        message: "Erreur lors de l'activation du compte",
        error: error.message,
      });
  }
});





module.exports = router;