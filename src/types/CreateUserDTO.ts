export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
}

export interface SignInUserDTO {
  password: string;
  email: string;
}
