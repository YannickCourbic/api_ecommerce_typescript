import { DataTypes, Model } from "sequelize";
import SequelizeConnection from "../data/SequelizeConnection";
import moment from "moment-timezone";
import Product from "./Product";

class Media extends Model {
  id!: number;
  src!: string;
  type!: string;
  createdAt!: Date;
  updatedAt!: Date;
  productId!: number; // Ajout de la clé étrangère vers Product

  static associate() {
   Media.belongsTo(Product, {
     foreignKey: "productId",
   });
   Product.hasMany(Media, {
     foreignKey: "productId",
     onDelete: "CASCADE",
   });
  }
}


Media.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    src: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
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
      allowNull: true,
    },

    productId : {
      type:DataTypes.INTEGER,
      allowNull: true,
      validate : {
        isProductValid : async (value:number)=>{
          const existingProduct = await Product.findByPk(value);
          if(!existingProduct) throw new Error("l'identifiant ne correspond pas à un produit.")
        }
      }
    }
  },
  {
    tableName: "media",
    sequelize: SequelizeConnection.getSequelize(),
  }
);

Media.associate();


export default Media;