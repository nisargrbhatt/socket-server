import { User } from "../models";

export class UserService {
  get(_id: string) {
    return User.findById(_id);
  }

  create(data: any) {
    return User.create(data);
  }

  list() {
    return User.find();
  }

  delete(_id: string) {
    return User.findByIdAndDelete(_id);
  }

  getByEmail(email: string) {
    return User.findOne({
      email,
    });
  }
}
