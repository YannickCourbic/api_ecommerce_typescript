import Product from "../model/Product";
import Media from "../model/Media";
import IMediaRepository from "./IMediaRepository";

class MediaRepository implements IMediaRepository {
  create(mediaData: {
    id: number;
    src: string;
    type: string;
    productId: number|null; // Aj
  }): Promise<Boolean | Media> {
    return Media.create({
      id: mediaData.id,
      src: mediaData.src,
      type: mediaData.type,
      productId: mediaData.productId,
    });
  }
  findAll(): Promise<Media[]> {
    return Media.findAll({ include: [{ model: Product }] });
  }
  findAllByProduct(id: number): Promise<Media[] | null> {
    return Media.findAll({ where: { productId: id } });
  }
  findById(id: number): Promise<Media | null> {
    return Media.findByPk(id);
  }
  update(mediaData: {
    id: number;
    src: string;
    type: string;
    productId: number; // Aj
  }): Promise<Media | Boolean | any> {
    const objs : {id?:number, src?:string, type?:string, productId?:number} = {};
    if(mediaData.src !== ""){
        objs.src = mediaData.src;
    }
    else if(mediaData.type !== ""){
        objs.type = mediaData.type;
    }
    return Media.update(objs , {where : {id: mediaData.id}});

  }
  delete(id: number): Promise<number | Media> {
    return Media.destroy({where:{id :id}, cascade: false});
  }
}

export default MediaRepository;
