export interface IRegistration {
    name?: string;
    uin?: string;
    addr?: string;
    postal?: string;        
    email?: string;
    password?: string;
    contactNo?: string;
    drugAllergy?: string;       
}

export class Registration implements IRegistration {
    constructor(
        public name?: string,
        public uin?: string,
        public addr?: string,
        public postal?: string,     
        public email?: string,
        public password?: string,
        public contactNo?: string,
        public drugAllergy?: string      
    ) {}
}