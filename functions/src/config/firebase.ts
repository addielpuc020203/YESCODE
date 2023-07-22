import * as admin from "firebase-admin";
import serviceAccount from "../addiel.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();
export {admin, db};