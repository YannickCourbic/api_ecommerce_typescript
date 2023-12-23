import { Op } from "sequelize";
import Category from "../model/Category";
import ICategoryRepository from "./ICategoryRepository";

class CategoryRepository implements ICategoryRepository {
  create(categoryData: {
    title: string;
    slug: string;
    description: string | null;
    logo: string | null;
    updatedAt: Date | null;
    parentId: number | Category | null;
  }): Promise<Boolean | Category> {
    return Category.create({
      title: categoryData.title,
      slug: categoryData.slug,
      description: categoryData.description,
      logo: categoryData.logo,
      updatedAt: categoryData.updatedAt,
      parentId: categoryData.parentId,
    });
  }
  findAll(): Promise<Category[]> {
    return Category.findAll({
      include: [
        {
          model: Category,
          as: "children",
        },
      ],
    });
  }
  findById($id: number): Promise<Category | null> {
    return Category.findByPk($id, {
      include: [
        {
          model: Category,
          as: "children",
        },
      ],
    });
  }
  update(categoryData: {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    logo: string | null;
  }): Promise<boolean | Category | any> {
    return Category.update(categoryData, { where: { id: categoryData.id } });
  }
  delete(id: number): Promise<number | boolean> {
    return Category.destroy({ where: { id: id } });
  }

  findByName(slug: string): Promise<Category | null> {
    return Category.findOne({
      where: { slug: slug },
      include: [{ model: Category, as: "children" }],
    });
  }

  deleteCascade(id: number): Promise<number | Category> {
    return Category.destroy({
      where: {id: id},
      cascade: true
    })
  }
}


export default CategoryRepository;