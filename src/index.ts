import express from "express";
import dotenv from "dotenv";
import sequelizeConnection from "./data/SequelizeConnection";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// sequelizeConnection.getSequelize().authenticate()
// .then(() => {
//     console.log("Connexion à la base de données réussie");
    
// })
// .catch((error) => {
//     console.error('Erreur lors de la connexion à la base de données : ' , error)
// })

try {
    app.listen(port , () => {
    console.log(`[server] :  Server is running at http://localhost:${port}`);
});
} catch (error) {
    console.log(`Error occurred : ${error}`);   
}

