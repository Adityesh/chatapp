declare global {
  namespace Express {
    interface Request {
      user?: User;
      login(user: User, done: (err: any) => void): void;
      logout(done: (err: any) => void): void;
      isAuthenticated(): boolean;
      isUnauthenticated(): boolean;
    }
  }
}
