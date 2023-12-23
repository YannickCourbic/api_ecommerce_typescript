import Media from "../model/Media";

interface IMediaRepository{
    create(mediaData:Media):Promise<Media|Boolean>
    findAll():Promise<Media[]>
    findById(id:number):Promise<Media|null>
    findAllByProduct(id:number):Promise<Media[]|null>
    update(mediaData:Media):Promise<Media|Boolean>
    delete(id:number):Promise<number|Media>
}

export default IMediaRepository;