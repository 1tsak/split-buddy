import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
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
import { useTranslation } from 'react-i18next';

const Chat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = auth.currentUser;
  const { groupId } = useParams<{ groupId: string }>();

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
        username: user?.displayName || "Anonymous",
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
        {messages.length > 0 ? (
          messages.map((msg: any) => (
            <ListItem key={msg.id}>
              <ListItemText
                style={{
                  textAlign: msg.userId === user?.uid ? "end" : "start",
                }}
                primary={msg.username}
                secondary={msg.message}
              />
            </ListItem>
          ))
        ) : (
          <p className="text-center self-center m-10 text-sm text-gray-400">
            {t('chat.waitingForMessages')}
          </p>
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
          placeholder={t('chat.placeholder')}
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
