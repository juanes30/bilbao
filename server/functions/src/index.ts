import user from "./user";
import cron from "./cron";

import * as admin from "firebase-admin";

admin.initializeApp();

export const deleteAccountUser = user.deleteAccountUser;
export const resetPasswordEmail = user.resetPasswordEmail;

export const createContactIcommk = cron.createContactIcommk;
