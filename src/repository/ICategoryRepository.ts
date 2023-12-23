import Category from "../model/Category";

interface ICategoryRepository{
    create (categoryData:Category):Promise<Category|Boolean>
    findAll():Promise<Category[]>
    findById(id:number):Promise<Category | null>
    findByName(name:string):Promise<Category|null>
    update(categoryData:Category):Promise<Category|boolean>
    delete(id:number):Promise<boolean | number>
    deleteCascade(id:number):Promise<number|Category>
}

export default ICategoryRepository;