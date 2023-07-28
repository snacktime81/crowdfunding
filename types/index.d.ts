import UserModel from '../models/user';

interface CustomError extends Error {
  status?: number;
}


declare global {
  namespace Express {
    interface Request {
      user: UserInfo;
    }
  }
}

export { CustomError, User };