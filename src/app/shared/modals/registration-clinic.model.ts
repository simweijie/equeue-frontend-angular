import { Time } from '@angular/common';
import { RegistrationStaff } from '../modals/registration-staff.model';

export interface IRegistrationClinic {
    clinicName?: string;
    branches?: Array<object>;
}

export class RegistrationClinic extends RegistrationStaff {
    constructor(
        public clinicName?: string,
        public branches?: Array<object>
    ) {
        super();
    }
}