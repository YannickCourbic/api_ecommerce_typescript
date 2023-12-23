import User from "../model/User";

interface IUserRepository {
  create(userData: {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    roles: string[];
    isActive: Boolean;
  }): Promise<User | Boolean>;

  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[] | null>;
  update(userData: {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    roles: string[];
    isActive:Boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<User | Boolean | number | any>;

  delete(id:number):Promise<User|number>;
}

export default IUserRepository;