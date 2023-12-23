import Product from "../model/Product";

interface IProductRepository{
    create(productData:Product):Promise<Product|Boolean>
    findAll():Promise<Product[]|null>
    findById(id:number):Promise<Product|null>
    findByName(name:string):Promise<Product|null>
    findBySlug(slug:string):Promise<Product|null>
    search(name:string):Promise<Product[]|null>
    update(productData:Product):Promise<Product|boolean|number>
    delete(id:number):Promise<boolean|number>

}

export default IProductRepository;