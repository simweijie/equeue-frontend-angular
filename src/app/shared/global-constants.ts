import {Login} from './modals/login.modal';

export class GlobalConstants {
  public static login = new Login();
  public static clinicId: string | '';
  public static branchId: string | '';
  public static serachType = 'N';
}
