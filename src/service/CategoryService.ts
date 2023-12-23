import Category from "../model/Category";
import CategoryRepository from "../repository/CategoryRepository";
class CategoryService {
  private categoryRepository = new CategoryRepository();

  create(categoryData: {
    title: string;
    slug: string;
    description: string | null;
    logo: string | null;
    updatedAt: Date | null,
    parentId: number | Category | null,
  }): Promise<Category | Boolean> {
    
    return this.categoryRepository.create(categoryData);
  }

  update(categoryData: {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    logo: string | null;
  }): Promise<Category | Boolean> {
    return this.categoryRepository.update(categoryData);
  }

  findAll():Promise<Category[]>{
        return this.categoryRepository.findAll();
  }

  findById(id:number):Promise<Category|null>{
    return this.categoryRepository.findById(id);
  }

  delete(id:number):Promise<number | boolean>{
    return this.categoryRepository.delete(id);
  }

  findByname(slug:string):Promise<Category|null> {
    return this.categoryRepository.findByName(slug);
  }

  deleteCascade(id:number):Promise<Category|number>{
    return this.categoryRepository.deleteCascade(id);
  }
}

export default CategoryService;