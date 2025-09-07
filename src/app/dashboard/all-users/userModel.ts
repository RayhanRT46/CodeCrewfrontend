export class userModel{
    constructor(
        public id:number,
        public fullName:string,
        public email:string ='',
        public phone: string='',
        public role: string,
        public isActive: boolean,
        public createdAt: Date
    ){

    }
}