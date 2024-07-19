import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../firebaseConfig';
import { updateUserProfile } from '../services/firebaseAuth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { User } from '../utils/types';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const UserProfile: React.FC = () => {
  const [authUser, loading] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setDisplayName(authUser.displayName || '');
      setPhotoURL(authUser.photoURL || '');
    }
  }, [authUser]);

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
        setUser({ ...user, displayName, photoURL });
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Avatar src={photoURL} alt={displayName} sx={{ width: 100, height: 100, mb: 2 }} />
      <TextField
        label="Name"
        value={displayName}
        onChange={handleNameChange}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
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
      <Box sx={{ height: '400px', width: '100%', mb: 2 }}>
        {location && (
          <LoadScript googleMapsApiKey="AIzaSyAb97UQI3KZz47TramGUsMDqck4LCq8Mt8">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={location}
              zoom={15}
            >
              <Marker position={location} />
            </GoogleMap>
          </LoadScript>
        )}
      </Box>
    </Box>
  );
};

export default UserProfile;

