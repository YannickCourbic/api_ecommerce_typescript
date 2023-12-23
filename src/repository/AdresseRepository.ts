import User from "../model/User";
import Adresse from "../model/Adresse";
import IAdresseRepository from "./IAdresseRepository";

class AdresseRepository implements IAdresseRepository{
    create(adresseData: { id: number; street: string; city: string; country: string; userId: number; }): Promise<Boolean | Adresse> {
        return Adresse.create(adresseData);
    }
    findById(id: number): Promise<Adresse | null> {
        return Adresse.findByPk(id , {include:User});
    }
    findAll(): Promise<Adresse[] | null> {
        return Adresse.findAll({include:User});
    }
    update(adresseData: { id: number; street: string; city: string; country: string; userId: number; }): Promise<any> {
        const objs: {
            id?: number,
            street?: string,
            city?: string,
            country?: string,
            userId?: number,
        } = {};
        if(adresseData.street != "")objs.street = adresseData.street;
        if(adresseData.city != "")objs.city = adresseData.city;
        if(adresseData.country != "")objs.country = adresseData.country;

        return Adresse.update(objs ,{where:{id:adresseData.id}});
    }
    delete(id: number): Promise<number | Adresse> {
        return Adresse.destroy({where:{id: id}});
    }
}

export default AdresseRepository;