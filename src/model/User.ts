import { DataTypes , Model } from "sequelize";
import SequelizeConnection from "../data/SequelizeConnection";
import moment from "moment-timezone";

class User extends Model {
    id!: number;
    firstname!:string;
    lastname!:string;
    username!:string;
    email!:string;
    password!:string;
    roles!:string[];
    isActive!:boolean;
    token!:string;
    createdAt!:Date;
    updatedAt!:Date;
    // un utilisateur peut avoir plusieurs adresses et une adresses correspond qu'a un seul utilisateur 
    // User.hasMany(Adresses)
    // Adresses.belongsTo(User)
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: "Le prénom doit contenir au moins 2 caractères et maximum 100 caractères.",
        },
        notEmpty: {
          msg: "le prénom ne peut être vide.",
        },
        isAlpha: {
          msg: "le prénom ne peut être que des caractères.",
        },
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: "Le nom de famille doit contenir au moins 2 caractères et maximum 100 caractères.",
        },
        notEmpty: {
          msg: "le nom de famille ne peut être vide.",
        },
        isAlpha: {
          msg: "le nom de famille ne peut être que des caractères.",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [2, 30],
          msg: "le pseudo doit contenir au moins 2 caractères et maximum 30 caractères.",
        },
        notEmpty: {
          msg: "le pseudo ne peut être vide",
        },
        isAlphanumeric: {
          msg: "le pseudo ne peut être que des caractères alphanumériques.",
        },
        isUniqueUsername: async (value: string) => {
          const user = await User.findOne({ where: { username: value } });
          if (user)
            throw new Error(
              "Le pseudo est déjà utilisé par un utilisateur , veuillez en choisir un autre."
            );
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "l'email ne peut être vide.",
        },
        isEmail: {
          msg: "l'email n'est pas valide, veuillez réessayez avec un email valide (test@xyz.com).",
        },
        isUniqueEmail: async (value: string) => {
          const user = await User.findOne({ where: { email: value } });
          if (user)
            throw new Error(
              "l'email est déjà utilisé par un utilisateur, veuillez réessayez avec un email différent."
            );
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "le mot de passe ne peut être vide.",
        },
        is: {
          args: "^(?=.*[A-Z])(?=.*[W_])(?=.*[0-9]).{7,}$",
          msg: "Le mot de passe n'est pas assez fort , il doit au moins avoir 7 caractères , dont 1 majuscule , 1 caractère spéciaux et 1 chiffre",
        },
      },
    },
    roles: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "le role ne peut être vide.",
        },
        isValidRole: async (value: string[]) => {
          const validRole = [
            "ROLE_USER",
            "ROLE_ADMIN",
            "ROLE_MODERATOR",
            "ROLE_SUPERADMIN",
            "ROLE_SELLER",
          ];
          value.forEach((role: string) => {
            if (!validRole.includes(role))
              throw new Error(
                "Le role est invalide, veuillez reéssayez avec un role valide."
              );
          });
        },
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive : {
      type: DataTypes.BOOLEAN,
      allowNull:false
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
      get() {
        // Utilisez moment-timezone pour formater la date avec le fuseau horaire souhaité
        const date = this.getDataValue("createdAt");
        return moment(date).tz("Europe/Paris").format(); // Exemple : fuseau horaire Europe/Paris
      },
    },
  },
  {
    tableName: "user",
    sequelize: SequelizeConnection.getSequelize(),
  }
);


export default User;