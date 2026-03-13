import { User } from '../models/model';
import { Basket } from '../models/Basketmodels';

declare global {
  namespace Express {
    interface Locals {
      user?: User;
      basket?: Basket;
    }
  }
}
