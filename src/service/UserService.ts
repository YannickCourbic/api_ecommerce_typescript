import User from "../model/User";
import UserRepository from "../repository/UserRepository";

class UserService {
    private userRepository = new UserRepository();

    create(userData: {
        firstname: string;
        lastname: string;
        username: string;
        email: string;
        password: string;
        roles: string[];
        isActive:Boolean
    }): Promise<User | Boolean> {
        return this.userRepository.create(userData);
    }

    findAll(): Promise<User[] | null> {
        return this.userRepository.findAll();
    }

    findById(id: number): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    update(userData: {
        id: number;
        firstname: string;
        lastname: string;
        username: string;
        email: string;
        password: string;
        roles: string[];
        isActive:Boolean;
    }): Promise<any> {
        return this.userRepository.update(userData);
    }

    delete(id:number):Promise<User|number>{
        return this.userRepository.delete(id);
    }

    findEmailOrUsername(emailOrUsername?:string):Promise<User|null>{
        return this.userRepository.findByEmailOrUsername(emailOrUsername);
    }

    modifyPassword(password:string, id:number):Promise<any>{
        return this.userRepository.modifyPassword(password, id);
    }

    modifyEmail(email:string , id:number):Promise<any>{
        return this.userRepository.modifyEmail(email ,id);
    }

    modifyUsername(username:string , id:number):Promise<any>{
        return this.userRepository.modifyUsername(username , id);
    }
    modifyCurrentInformation(data:{id:number; firstname:string; lastname:string}):Promise<any>{
        return this.userRepository.modifyCurrentInformation(data);
    }
    modifyStatus(status:string , id:number):Promise<any>{
        return this.userRepository.modifyStatus(status, id);
    }
    modifyRoles(roles:string[] , id:number):Promise<any>{
        return this.userRepository.modifyRoles(roles ,id);
    }
    
}

export default UserService;