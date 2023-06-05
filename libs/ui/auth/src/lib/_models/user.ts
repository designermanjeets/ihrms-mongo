export enum Role {
  Admin = 'ADMIN',
  Employee = 'EMPLOYEE',
  GONNGOD = 'GONNGOD',
}

export interface User {
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  eCode?: string;
  token?: string;
  userImg?: string;
  role?: Role;
  designation?: string;
  userID?: string
}
