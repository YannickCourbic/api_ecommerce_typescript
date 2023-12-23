import { DataTypes , Model } from "sequelize";
import SequelizeConnection from "../data/SequelizeConnection";
import moment from "moment-timezone";
import User from "./User";
class Adresse extends Model {
    id!:number;
    street!:string;
    city!:string;
    zipcode!:number;
    country!:string;
    userId!:number;
    static associate(){
        User.hasMany(Adresse , {
            foreignKey: "userId"
        });
        Adresse.belongsTo(User, {
            foreignKey: "userId"
        });
    }
}

Adresse.init({
    id: {type:DataTypes.INTEGER,
         autoIncrement:true, 
         primaryKey:true
        },
    street : {
        type:DataTypes.STRING,
        allowNull:false
    },
    city : {
        type:DataTypes.STRING,
        allowNull:false
    },
    zipcode:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    country:{
        type:DataTypes.STRING,
        allowNull:false
    },
    userId: {
        type:DataTypes.INTEGER,
        allowNull: false
    }
},{
    tableName: "adresse",
    sequelize: SequelizeConnection.getSequelize()
});

Adresse.associate();

export default Adresse;