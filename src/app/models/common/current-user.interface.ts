export interface IUser {
  id: string;
  email: string;
  username: string;
}

export interface ICurrentUser {
  user: IUser;
}
