import {  DataTypes, Model } from "sequelize";
import SequelizeConnection from "../data/SequelizeConnection";
import moment from "moment-timezone";
import Category from "./Category";
import Media from "./Media";

class Product extends Model {
    id!:number;
    name!:string;
    slug!:string;
    status!:string;
    price!:number;
    stock!:number;
    tva!:number;
    like!:number;
    createdAt!:Date;
    updatedAt!:Date;
    categoryId!:number;
    medias!:Media[]|null;
    static associate(){
        Product.belongsTo(Category , {
            foreignKey: "categoryId"
        });
        Category.hasMany(Product, {
            foreignKey: "categoryId"
        });

        
    }

};


Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 100],
          msg: "La longueur du nom du produit doit être entre 3 et 100 caractères.",
        },
        notEmpty: {
          msg: "Le nom du produit ne peut pas être vide. Veuillez fournir un titre.",
        },
        notNull: {
          msg: "Le nom du produit ne peut pas être null. Veuillez fournir un titre.",
        },
        isUnique: async function (value: string) {
          const existingProduct = await Product.findOne({
            where: { name: value },
          });
          if (existingProduct) {
            throw new Error("Le titre doit être unique");
          }
        },
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "le status ne peut être vide.",
        },
        notNull: {
          msg: "le status ne peut être null.",
        },
        validStatus: async (value: string) => {
          const status = ["draw", "public", "trash"];
          if (!status.includes(value)) {
            throw new Error(
              "le status du produit ne peut être que soit 'trash', 'draw' et 'public'"
            );
          }
        },
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "le prix ne peut être vide.",
        },
        isPositif: async (value: number) => {
          if (value <= 0) {
            throw new Error("le prix ne peut être inférieur ou égal à zéro.");
          }
        },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isPositif: async (value: number) => {
          if (value < 0) {
            throw new Error("le stock ne peut être inférieur ou égal à zéro.");
          }
        },
        notEmpty: {
          msg: "le stock ne peut être vide.",
        },
      },
    },
    tva: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isPositif: async (value: number) => {
          if (value < 0) {
            throw new Error("le stock ne peut être inférieur ou égal à zéro.");
          }
        },
        notEmpty: {
          msg: "la tva ne peut être vide.",
        },
      },
    },

    like: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isPositif: async (value: number) => {
          if (value < 0) {
            throw new Error("le nombre de like  ne peut être inférieur à zéro.");
          }
        },
        notEmpty: {
          msg: "le nombre de like ne peut être vide.",
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        // Utilisez moment-timezone pour formater la date avec le fuseau horaire souhaité
        const date = this.getDataValue("createdAt");
        return moment(date).tz("Europe/Paris").format(); // Exemple : fuseau horaire Europe/Paris
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isCategoryValid: async (value: number) => {
          const existingCategory = await Category.findByPk(value);
          console.log(existingCategory);

          if (!existingCategory) {
            throw new Error("l'identifiant ne correpond à aucune Category.");
          }
        },
      },
    },
  },
  {
    tableName: "product",
    sequelize: SequelizeConnection.getSequelize(),
  }
);

Product.associate();

export default Product;