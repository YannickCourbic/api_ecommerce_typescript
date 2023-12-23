import Media from "../model/Media";
import MediaRepository from "../repository/MediaRepository";

class MediaService {
  private mediaRepository = new MediaRepository();

  create(mediaData: {
    id: number;
    src: string;
    type: string;
    productId: number|null; // Aj
  }):Promise<Media|Boolean> {
    return this.mediaRepository.create(mediaData);
  }

  findAll():Promise<Media[]|null>{
    return this.mediaRepository.findAll();
  }

  findAllByProduct(id:number):Promise<Media[]|null>{
    return this.mediaRepository.findAllByProduct(id);
  }

  findById(id:number):Promise<Media|null>{
    return this.mediaRepository.findById(id);
  }


  update(mediaData: {id:number,src:string, type:string,productId:number}):Promise<Media|Boolean|any>{
    return this.mediaRepository.update(mediaData);
  }

  delete(id:number):Promise<number|Media>{
    return this.mediaRepository.delete(id);
  }
  
}

export default MediaService;