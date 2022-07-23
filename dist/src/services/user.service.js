"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const models_1 = require("../models");
class UserService {
    get(_id) {
        return models_1.User.findById(_id);
    }
    create(data) {
        return models_1.User.create(data);
    }
    list() {
        return models_1.User.find();
    }
    delete(_id) {
        return models_1.User.findByIdAndDelete(_id);
    }
    getByEmail(email) {
        return models_1.User.findOne({
            email,
        });
    }
}
exports.UserService = UserService;
