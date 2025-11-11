import { User } from '@prisma/client';
import { Request } from 'express';

export interface AuthenticatedRequest<Params = any, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: User;
}

export interface MulterFile {
  file: Express.Multer.File;
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}


export interface MulterRequest<Params = any, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<Params, ResBody, ReqBody, ReqQuery> {
  file?: Express.Multer.File;
  files?: Express.Multer.File[] | {
    [fieldname: string]: Express.Multer.File[];
  };
}