import {Login} from './modals/login.modal';

export class GlobalConstants {
  public static login = new Login();
  public static clinicId: string | null = '';
  public static branchId: string | null = '';
  public static serachType = 'N';
}
