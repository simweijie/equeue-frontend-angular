export interface IRegistrationStaff {
    name?: string;
    uin?: string;
    addr?: string;
    postal?: string;        
    email?: string;
    password?: string;
    contactNo?: string;
    occupation?: string; 
    clinic?: string; 
    branch?: string;       
}

export class RegistrationStaff implements IRegistrationStaff {
    constructor(
        public name?: string,
        public uin?: string,
        public addr?: string,
        public postal?: string,     
        public email?: string,
        public password?: string,
        public contactNo?: string,
        public occupation?: string,  
        public clinic?: string,
        public branch?: string     
    ) {}
}