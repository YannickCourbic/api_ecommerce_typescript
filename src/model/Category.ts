import { DataTypes, Model  } from "sequelize";
import SequelizeConnection from "../data/SequelizeConnection";
import moment from "moment-timezone";


class Category extends Model {
  id!: number;
  title!: string;
  slug!: string;
  description!: string | null;
  logo!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  parentId!: number | null;


  static associate(models: any) {
    Category.belongsTo(models.Category, {
      foreignKey: "parentId",
      as: "parent",
    });
    Category.hasMany(models.Category,  {
      foreignKey: "parentId",
      as: "children",
      onDelete: "CASCADE"
    });
  }
}


Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 50],
          msg: "La longueur du titre doit être entre 3 et 50 caractères.",
        },
        notEmpty: {
          msg: "Le titre ne peut pas être vide. Veuillez fournir un titre.",
        },
        notNull: {
          msg: "Le titre ne peut pas être null. Veuillez fournir un titre.",
        },
        isUnique: async function (value: string) {
          const existingCategory = await Category.findOne({
            where: { title: value },
          });
          if (existingCategory) {
            throw new Error("Le titre doit être unique");
          }
        },
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        // Utilisez moment-timezone pour formater la date avec le fuseau horaire souhaité
        const date = this.getDataValue("myDateField");
        return moment(date).tz("Europe/Paris").format(); // Exemple : fuseau horaire Europe/Paris
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "category",
    sequelize: SequelizeConnection.getSequelize(),
  }
);

Category.associate({Category:Category});

export default Category;