import Adresse from "../model/Adresse";
import User from "../model/User";
import IUserRepository from "./IUserRepository";

class UserRepository implements IUserRepository{
    create(userData: {  firstname: string; lastname: string; username: string; email: string; password: string; roles: string[]; isActive:Boolean; }): Promise<Boolean | User> {
      
        return User.create(userData);
    }
    findById(id: number): Promise<User | null> {
        return User.findByPk(id , {include: Adresse});
    }
    findAll(): Promise<User[] | null> {
        return User.findAll({include:Adresse});
    }
    update(userData: { id: number; firstname: string; lastname: string; username: string; email: string; password: string; roles: string[]; isActive:Boolean; }): Promise<any> {
        const objs: {
            id?: number,
            firstname?: string,
            lastname?: string,
            username?: string,
            email?: string,
            password?: string,
            roles?: string[],
        } = {};
        if(userData.firstname !== "") objs.firstname = userData.firstname;
        if(userData.lastname !== "")objs.lastname = userData.lastname;
        if(userData.username !== "" )objs.username = userData.username;
        if(userData.email !== "")objs.email = userData.email;
        if(userData.password !== "")objs.password = userData.password;
        if(userData.roles)objs.roles = userData.roles;
        return User.update(objs , {where: {id: userData.id}});
    }
    delete(id: number): Promise<number  | User> {
        return User.destroy({where: {id:id}});
    }


    findByEmailOrUsername(emailOrUsername?:string):Promise<User|null>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(emailRegex.test(emailOrUsername as string)){
            return User.findOne({where:{email: emailOrUsername}});
        }
        return User.findOne({where:{username: emailOrUsername}});
    }
    
    modifyPassword(password:string , id:number):Promise<number|User|any> {
        return User.update({password: password} , {where: {id:id}});
    }

    modifyEmail(email:string, id:number):Promise<any>{
        return User.update({email: email} , {where:{id:id}});
    }

    modifyUsername(username:string , id:number):Promise<any>{
        return User.update({username: username} , {where:{id:id}});
    }

    modifyCurrentInformation(data:{id:number; firstname:string; lastname:string;}):Promise<any>{
        return User.update({
            firstname : data.firstname,
            lastname: data.lastname,
        }, {where: {id: data.id}})
    }

    modifyStatus(status:string , id:number):Promise<any>{
        return User.update({status: status}, {where: {id:id}});
    }

    modifyRoles(roles:string[] , id:number):Promise<any>{
        return User.update({roles : roles} , {where: {id:id}})
    }

    
}

export default UserRepository;