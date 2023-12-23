const express = require("express");
 // Assurez-vous d'importer express-session
const session = require("express-session");
const cors = require("cors");
import bodyParser from "body-parser";
import dotenv from "dotenv";
import SequelizeConnection from "./data/SequelizeConnection";
import Category from "./model/Category";
import Product from "./model/Product";
import Media from "./model/Media";
import User from "./model/User";
import Adresse from "./model/Adresse";
import { NextFunction } from "express";
const categoryRouter = require("./router/category.route");
const productRouter = require("./router/product.route");
const mediaRouter = require("./router/media.route");
const userRouter = require("./router/user.route");
const securityRouter = require("./router/security.route");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(
  session({
    secret: "8s24Sc6dGnp2MCxQQ2p5",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use("/api/v1/ecommerce/category" , categoryRouter);
app.use("/api/v1/ecommerce/product" , productRouter);
app.use("/api/v1/ecommerce/media", mediaRouter);
app.use("/api/v1/ecommerce/user", userRouter);
app.use("/api/v1/ecommerce/security", securityRouter);


// Category.sync({force:true});
// Product.sync({ force: true });
// Media.sync({ force: true });
// User.sync({force:true});
// Adresse.sync({force:true});

SequelizeConnection.getSequelize()
  .authenticate()
  .then(() => {
    console.log("[database]: Connexion à la base de données réussie.");
  })
  .catch((erreur) => {
    console.error("Erreur lors de la connexion à la base de données :", erreur);
  });

try {
    app.listen(port , () => {
    console.log(`[server] :  Server is running at http://localhost:${port}`);
});
} catch (error) {
    console.log(`Error occurred : ${error}`);   
}


