import { UserObj } from "../../common/models/user.model";
import { Api } from "./_abstract.api";

export const userApi = Api<UserObj>('user');
