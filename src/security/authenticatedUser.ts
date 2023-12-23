import {Request , Response , NextFunction} from "express";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");
const secretKey = process.env.SECRET as string || "8s24Sc6dGnp2MCxQQ2p5";
import UserService from "../service/UserService";
import nodemailer from "nodemailer";
const userService = new UserService();

export const createTokenAndVerifyEmailOrUsername = async (req:any, res:Response, next:NextFunction) => {
    //on vérifie si ce n'est pas un email ou pas 
      const user = await userService.findEmailOrUsername(
        req.body.emailOrUsername
      );
      if(!user){ 
        return res.status(401).json({message: "Identifiants invalides. Veuillez réessayer avec des identifiants valides."});
      }
      //si le mot de passe est identique en les comparant avec bcript, alors je vais générer et renvoyer un token utilisable
      //je vais comparer les mot de passe.
      const passwordMatch = await bcrypt.compare(req.body.password , user.password);
      console.log(passwordMatch);
      
      if(passwordMatch === false){
        return res.status(401).json({message:"Identifiants invalide , veuillez réessayez avec des identifiants valides."});
      }
      //c'est ainsi que je génère le token
      const token = jwt.sign({data:user} , secretKey , {expiresIn: "10h"});
      //je le retourne dans réponse json
        req.session.connection = 1;
        return res.status(200).json({
          message: "vous êtes connectée avec succès.",
          token: token,
        });
};

export const authentification = async (req:any , res:Response<any>, next:NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer " , "");
  if(!token) return res.status(401).json({message: "Non autorisé. Token invalide."});
  try {
    const decoded:any = jwt.verify(token, secretKey);    
    req.session.user = decoded.data;  
    console.log(req.session.user);
  
    if(!req.session.connection) return res.status(401).json({message:"Vous n'êtes pas connecté , veuillez vous connectez."});

    next();
  } catch (error) {
    return res.status(401).json({message:"Non autorisé. Token invalide."});
  }
}

export const isGranted =  (requiredRoles:string[]) => {
 return (req:any , res:Response , next:NextFunction ) => {
   if (!req.session.user || !req.session.user.roles) {
      return res.status(403).json({ message: "Vous n'êtes pas connecté." });
    }

    const userRoles = req.session.user.roles;

    // Vérifie si l'utilisateur a au moins un rôle requis
    const hasSufficientRole = requiredRoles.some((requiredRole) =>
      userRoles.includes(requiredRole)
    );

    if (!hasSufficientRole) {
      return res
        .status(401)
        .json({ message: "Vous n'avez pas un rôle suffisant." });
    }

    next();
  };
 }
  
 export const generateToken = (data:any) => {
   return jwt.sign({ data: data }, secretKey, { expiresIn: "1h" });
 };


 export const transporteur = nodemailer.createTransport({
   service: "gmail",
   auth: {
     user: "a.yacine2023@gmail.com",
     pass: "bkmh wwcu scxv cbpk",
   },
 });



