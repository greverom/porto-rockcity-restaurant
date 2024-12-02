import { User } from "../../models/user";


export interface UserState {
    isAdmin: boolean;
    isLoggedIn: boolean;
    data: User | null;
  }