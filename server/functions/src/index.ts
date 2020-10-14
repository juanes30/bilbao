import user from "./user";

import * as admin from "firebase-admin";

admin.initializeApp();

export const deleteAccountUser = user.deleteAccountUser;
