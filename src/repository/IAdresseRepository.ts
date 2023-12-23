import Adresse from "../model/Adresse";

interface IAdresseRepository {
    create(userData: {
        id: number;
        street: string;
        city: string;
        country: string;
        userId: number;
    }): Promise<Adresse | Boolean>;
    findById(id: number): Promise<Adresse | null>;
    findAll(): Promise<Adresse[] | null>;
    update(userData: {
        id: number;
        street: string;
        city: string;
        country: string;
        userId: number;
    }): Promise<Adresse | Boolean | number | any>;
    delete(id:number):Promise<Adresse|number>
}

export default IAdresseRepository;