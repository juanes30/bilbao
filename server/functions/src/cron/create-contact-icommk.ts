import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

import { urlIcommk } from "../constants";

export const createContactIcommk = functions.firestore
  .document("barStaff/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const docSnap = await admin
      .firestore()
      .collection("regional")
      .doc(data.regionalId)
      .get();

    const dataRegional = docSnap.data();
    let regional = "";
    if (dataRegional) {
      regional = dataRegional.name;
    }

    axios
      .post(
        urlIcommk,
        {
          ProfileKey: "NDgwMzA30",
          Contact: {
            Email: data.email,
            CustomFields: [
              {
                Key: "Nombres",
                Value: data.name,
              },
              {
                Key: "Apellidos",
                Value: data.lastName,
              },
              {
                Key: "Cargo",
                Value: data.position,
              },
              {
                Key: "Establecimiento",
                Value: data.establishment,
              },
              {
                Key: "Celular",
                Value: data.cellphone,
              },
              {
                Key: "Regional",
                Value: regional,
              },
            ],
          },
        },
        {
          headers: {
            Authorization: "MTA0OS0yNDIyLWRpc2xpY29yZXNjbw2",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response: any) => {
        console.log(`RESPONSE ICOMMK: ${response}`);
        console.log(response);
      })
      .catch((error) => {
        console.error(`ERROR: ${error}`);
      });
  });
