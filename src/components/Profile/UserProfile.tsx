import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import { auth, storage } from '../../firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';


import { updateUserProfile } from '../../services/firebaseAuth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';
import { User } from 'firebase/auth';

const UserProfile: React.FC = () => {
  const { t } = useTranslation();
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
      const storageRef = ref(storage, `profileImages/${authUser?.uid}`);
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
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ padding: '20px', width: '100%', maxWidth: '600px', borderRadius: '12px' }}>
        <Typography variant="h4" gutterBottom align="center">
          {t('userProfile')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar src={photoURL} alt={displayName} sx={{ width: 120, height: 120, mb: 2 }} />
          <Button
            variant="contained"
            component="label"
            sx={{ mb: 2 }}
            disabled={uploading}
          >
            {uploading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                {`${t('uploading')} ${uploadProgress}%`}
              </Box>
            ) : (
              t('uploadPhoto')
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
        </Box>
        <TextField
          label={t('name')}
          value={displayName}
          onChange={handleNameChange}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSave}
          disabled={uploading}
          sx={{ mb: 2 }}
        >
          {t('save')}
        </Button>
        <Box sx={{ height: '300px', width: '100%' }}>
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
      </Paper>
    </Box>
  );
};

export default UserProfile;
