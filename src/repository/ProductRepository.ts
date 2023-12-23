import Category from "../model/Category";
import Product from "../model/Product"; 
import IProductRepository from "./IProductRepository";
import {Op} from "sequelize";
class ProductRepository implements IProductRepository {
  create(productData: {
    name: string;
    slug: string;
    status: string;
    price: number;
    stock: number;
    tva: number;
    categoryId: number;
  }): Promise<Boolean | Product> {
    return Product.create({
      name: productData.name,
      slug: productData.slug,
      status: productData.status,
      price: productData.price,
      stock: productData.stock,
      tva: productData.tva,
      like: 0,
      categoryId: productData.categoryId,
    });
  }
  findAll(): Promise<Product[] | null> {
    return Product.findAll({ include: [{ model: Category }] });
  }
  findById(id: number): Promise<Product | null> {
    return Product.findByPk(id, {
      include: [{ model: Category }],
    });
  }
  findByName(name: string): Promise<Product | null> {
    return Product.findOne({
      where: { name: name },
      include: [{ model: Category }],
    });
  }
  findBySlug(slug: string): Promise<Product | null> {
    return Product.findOne({
      where: { slug: slug },
      include: [{ model: Category }],
    });
  }
  search(search: string, limit?: number): Promise<Product[] | null> {
    return Product.findAll({
      where: { name: { [Op.like]: `%${search}%` } },
      limit: limit ? limit : 5,
    });
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
  }): Promise<Product | boolean | number | any> {

    const objs :{name?: string,slug?: string,status?: string,price?: number,stock?: number,tva?: number,categoryId?: number,} = {};
    if(productData.name !== ""){
          objs.name = productData.name;
          objs.slug = productData.slug;
    }
    objs.categoryId = productData.categoryId;
    objs.price = productData.price;
    objs.status = productData.status;
    objs.stock = productData.stock;
    objs.tva = productData.tva;

    return Product.update(objs, { where: { id: productData.id } });
  }
  delete(id: number): Promise<number | boolean> {
    return Product.destroy({ where: { id: id }, cascade: false });
  }
}

export default ProductRepository;