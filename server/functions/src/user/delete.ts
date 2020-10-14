import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const deleteAccountUser = functions.https.onRequest(
  async (req: any, res: any) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, apiKey"
    );

    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      const uid = req.body.uid;
      if (!uid) {
        const response = {
          message: "No se especificó que usuario se va a eliminar",
        };
        return res.status(404).json(response);
      }

      try {
        await admin.auth().deleteUser(uid);
        return res.status(200).json({ message: "Usuario Elminado" });
      } catch (error) {
        const response = {
          message: "Error al eliminar el usuario",
        };

        return res.status(500).json(response);
      }
    }
  }
);
