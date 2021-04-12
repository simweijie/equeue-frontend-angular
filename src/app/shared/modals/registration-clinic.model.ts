import { Time } from '@angular/common';
import { RegistrationStaff } from '../modals/registration-staff.model';

export interface IRegistrationClinic {
    clinicName?: string;
    branchTelephone?: string;
    clinicAddr?: string;        
    openingHourMonStart?: Time;
    openingHourMonEnd?: Time;
}

export class RegistrationClinic extends RegistrationStaff {
    constructor(
        public clinicName?: string,
        public branchTelephone?: string,
        public clinicAddr?: string,     
        public openingHourMonStart?: string,
        public openingHourMonEnd?: string  
    ) {
        super();
    }
}