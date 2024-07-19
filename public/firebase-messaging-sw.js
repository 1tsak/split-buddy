importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

 //the Firebase config object 
 const firebaseConfig = {
    apiKey: "AIzaSyBy7MqPrSiamySmvsadcj9_JCr5gGGOCgM",
    authDomain: "split-buddy-315cb.firebaseapp.com",
    projectId: "split-buddy-315cb",
    storageBucket: "split-buddy-315cb.appspot.com",
    messagingSenderId: "358215945843",
    appId: "1:358215945843:web:2122bffeb655b080ea6406",
    measurementId: "G-V6Z530SZBG"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});