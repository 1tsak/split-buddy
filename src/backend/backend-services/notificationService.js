const admin = require('firebase-admin');
const {getFirestore,Timestamp} = require('firebase-admin/firestore')

const serviceAccount = require("./firebase_admin.json");

const now = new Date();
const serverStartTime = Timestamp.fromDate(now);

const firebaseAdmin = admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
})
const db = getFirestore();

const dbCollection = {
    notification:db.collection('notifications'),
    groups:db.collection('groups'),
    users:db.collection('users'),
}

const sendPushNotification = async(deviceToken,title,body)=>{
    await firebaseAdmin.messaging().send({
        token:deviceToken,
        data:{
            title,
            body,
        }
    })
    console.log("Send Notification for the user :",deviceToken );
}

const notificationService=async ()=>{
    console.log("----------Notification Service Started---------")
    dbCollection.notification.onSnapshot(async querySnapshot=>{
        for(let notification of querySnapshot.docChanges()){
            if(notification.type=='added'){
                if(notification.doc.createTime>serverStartTime){
                    const groupRef = dbCollection.groups.doc(notification.doc.data().groupId);
                    const group = await groupRef.get();
                    const members = group.data().members;
                    for(const member of members){
                        const userRef = dbCollection.users.doc(member);
                        const user = await userRef.get();
                       if(user.data().deviceToken){
                        sendPushNotification(user.data()?.deviceToken,notification.doc.data().title,notification.doc.data().message)
                       }
                    }
                }
            }
        
        }
    })
}

module.exports = {notificationService}
