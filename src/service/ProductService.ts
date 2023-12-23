import Product from "../model/Product";
import ProductRepository from "../repository/ProductRepository";

class ProductService {
  private productRepository = new ProductRepository();

  create(categoryData: {
    name: string;
    slug: string;
    status: string;
    price: number;
    stock: number;
    tva: number;
    categoryId: number;
  }): Promise<Product | Boolean> {
    return this.productRepository.create(categoryData);
  }

  findAll(): Promise<Product[] | null> {
    return this.productRepository.findAll();
  }

  findById(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  findByName(name: string): Promise<Product | null> {
    return this.productRepository.findByName(name);
  }

  findBySlug(slug: string): Promise<Product | null> {
    return this.productRepository.findBySlug(slug);
  }
  search(search: string, limit?: number): Promise<Product[] | null> {
    return this.productRepository.search(search, limit);
  }

  update(productData: {
    id: number;
    name: string;
    slug: string;
    status: string;
    price: number;
    stock: number;
    tva: number;
    categoryId: number;
  }): Promise<Product | number> {
    return this.productRepository.update({
      id: productData.id,
      name: productData.name,
      slug: productData.slug,
      status: productData.status,
      price: productData.price,
      stock: productData.stock,
      tva: productData.tva,
      categoryId: productData.categoryId,
    });
  }

  delete(id: number) {
    return this.productRepository.delete(id);
  }
}


export default ProductService;