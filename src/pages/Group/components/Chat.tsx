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

const Chat = () => {
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
        Group Chat
      </Typography>
      <List sx={{ overflow: "auto", flex: "1" }}>
        {messages.map((msg: any) => (
          <ListItem key={msg.id}>
            <ListItemText
              style={{
                textAlign: msg.userId === user?.uid ? "start" : "end",
              }}
              primary={msg.username}
              secondary={msg.message}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", marginTop: 2, diaplay: "flex", gap: "1rem" }}>
        <TextField
          fullWidth
          variant="outlined"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button variant="outlined" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
