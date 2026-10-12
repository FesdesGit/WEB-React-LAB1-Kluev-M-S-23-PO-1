export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female';
  email: string;
  phone: string;
  image?: string;
  role?: string;
}
export type UserDraft = Omit<User, 'id'>;

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}