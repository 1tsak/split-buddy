import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  doc,
} from "firebase/firestore";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = auth.currentUser;
  const { groupId } = useParams<{ groupId: string }>();
  const { t } = useTranslation(); // Add translation hook

  useEffect(() => {
    if (!groupId) return;

    const groupRef = doc(db, "groups", groupId);
    const chatCollectionRef = collection(groupRef, "chats");
    const q = query(chatCollectionRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: any = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [groupId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const groupRef = doc(db, "groups", groupId);
      const chatCollectionRef = collection(groupRef, "chats");

      await addDoc(chatCollectionRef, {
        userId: user?.uid,
        username: user?.displayName || t('chat.anonymousUser'),
        message: newMessage,
        timestamp: new Date(),
      });
      setNewMessage("");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        margin: "auto",
        padding: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" color={"gray"} align="center">
        {t('chat.groupChat')}
      </Typography>
      <List sx={{ overflow: "auto", flex: "1" }}>
        {messages.length > 0 ? messages.map((msg: any) => (
          <ListItem key={msg.id}>
            <ListItemText
              style={{
                textAlign: msg.userId === user?.uid ? "end" : "start",
              }}
              primary={msg.username}
              secondary={msg.message}
            />
          </ListItem>
        )) : (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
            {t('chat.waitingForMessages')}
          </Typography>
        )}
      </List>
      <Box sx={{ display: "flex", marginTop: 2, gap: "1rem" }}>
        <TextField
          fullWidth
          variant="outlined"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder={t('chat.typeMessage')}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button variant="outlined" color="primary" onClick={handleSendMessage}>
          {t('chat.send')}
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
