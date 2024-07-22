import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebaseConfig";

export const FIREBASE_KEY =     "BF1LHOPAmZs8U1KkLkWSxz-TaHL64WWueNdjEL_EoKbvB4BagzU5hYJ8s5DafQ6_HPNBfJ03RP3HE0qVsHj396w";


export const  getClientCurrentToken=async():Promise<string> =>{
    const currentToken = await getToken(messaging,{ vapidKey: FIREBASE_KEY }).then((currentToken)=>currentToken);
    return currentToken
}

export const requestPermission = () => {
  console.log("Requesting User Permission......");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification User Permission Granted.");
      return getToken(messaging, {
        vapidKey:FIREBASE_KEY
      })
        .then((currentToken) => {
          if (currentToken) {
            console.log("Client Token: ", currentToken);
          } else {
            console.log("Failed to generate the app registration token.");
          }
        })
        .catch((err) => {
          console.log(
            "An error occurred when requesting to receive the token.",
            err
          );
        });
    } else {
      console.log("User Permission Denied.");
    }
  });
};



export const onMessageListener = () =>
    new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        console.log("payload",payload)
        resolve(payload);
      });
  });