export class Material
{
  constructor(
    public uid: string = "",
    public name: string = "",
    public price_p : number = 0,
    public price_t: number = 0,
    public spec_weigth: number = 1,
    public img_url: string = "")
    {

    }

    public map(dbObj : any) {      
        this.uid = dbObj.uid, 
        this.name = dbObj.name, 
        this.price_p = dbObj.price_p, 
        this.price_t = dbObj.price_t, 
        this.spec_weigth = dbObj.spec_weigth, 
        this.img_url = dbObj.img_url
        return this;
    }
}