import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { User } from '../utils/types';
import { updateUserProfile } from '../services/firebaseAuth';
import { storage } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
  onUserProfileUpdate: (updatedUser: User) => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onUserProfileUpdate,
}) => {
  const [displayName, setDisplayName] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const storageRef = ref(storage, `profileImages/${user?.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
          setUploading(true);
        },
        (error) => {
          console.error('Upload failed:', error);
          setUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setPhotoURL(downloadURL);
            setUploading(false);
          });
        }
      );
    }
  };

  const handleSave = async () => {
    if (user) {
      try {
        await updateUserProfile(user, { displayName, photoURL });
        onUserProfileUpdate({ ...user, displayName, photoURL });
        onClose(); // Close the modal
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '80px',
          width: '350px',
          borderRadius: '12px',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          outline: 'none',
          backgroundColor: '#fff',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Avatar
          src={photoURL}
          alt={displayName}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Edit Profile
        </Typography>
        <TextField
          label="Name"
          value={displayName}
          onChange={handleNameChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mb: 2 }}
          disabled={uploading}
        >
          {uploading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={24} sx={{ mr: 2 }} />
              {`Uploading ${uploadProgress}%`}
            </Box>
          ) : (
            'Upload Photo'
          )}
          <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
        </Button>
        {uploading && (
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ width: '100%', mb: 2 }}
          />
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSave}
          disabled={uploading}
          sx={{ mb: 2 }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={onLogout}
        >
          Log Out
        </Button>
      </Box>
    </Modal>
  );
};

export default UserInfoModal;
