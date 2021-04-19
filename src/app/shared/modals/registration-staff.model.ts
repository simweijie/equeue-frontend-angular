export interface IRegistrationStaff {
    name?: string;
    uin?: string;
    addr?: string;
    postal?: string;        
    email?: string;
    password?: string;
    contactNo?: string;
    job?: string; 
    clinic?: string; 
    branchId?: string;       
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
        public job?: string,  
        public clinic?: string,
        public branchId?: string     
    ) {}
}
