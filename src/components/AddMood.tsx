import { useState } from "react";
import { IonButton, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonAlert, IonSpinner, IonText } from "@ionic/react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import storage from "../Storage";
import { takePhoto, uploadToCloudinary, editPhoto } from "../Services/CameraService"; // Updated imports

interface Props {
  userId: string;
}

const moodOptions = [
  { emoji: "😄", color: "success", label: "Happy" },
  { emoji: "😢", color: "medium", label: "Sad" },
  { emoji: "😡", color: "danger", label: "Angry" },
  { emoji: "😌", color: "tertiary", label: "Calm" },
  { emoji: "😴", color: "warning", label: "Tired" },
];

export default function AddMood({ userId }: Props) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [stress, setStress] = useState<number | undefined>();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleTakePhoto = async () => {
    setUploadingPhoto(true);
    setUploadProgress('');
    try {
      const photoBase64 = await takePhoto();
      if (photoBase64) {
        setPhotoData(photoBase64);
        setAlertMessage("Photo ready! Click Save Mood to upload.");
      } else {
        setAlertMessage("Failed to take photo.");
      }
    } catch (error) {
      console.error("Photo error:", error);
      setAlertMessage("Error taking photo: " + (error as Error).message);
    }
    setUploadingPhoto(false);
  };

  // ADD THIS: Edit photo function
  const handleEditPhoto = async () => {
    setUploadingPhoto(true);
    try {
      const newPhotoUrl = await editPhoto(photoData);
      if (newPhotoUrl) {
        setPhotoData(newPhotoUrl);
        setAlertMessage("Photo updated successfully!");
      } else {
        setAlertMessage("Failed to update photo.");
      }
    } catch (error) {
      console.error("Photo edit error:", error);
      setAlertMessage("Error updating photo.");
    }
    setUploadingPhoto(false);
  };

  // ADD THIS: Remove photo function
  const handleRemovePhoto = () => {
    setPhotoData(null);
    setAlertMessage("Photo removed.");
  };

  const handleRefresh = () => {
  setSelectedMood(null);
  setNote("");
  setStress(undefined);
  setPhotoData(null);
  setUploadProgress("");
  setAlertMessage("Form has been refreshed!");
};
  const handleSubmit = async () => {
    if (!selectedMood) {
      setAlertMessage("Please select a mood!");
      return;
    }


    if (!note || note.trim() === "") {
      setAlertMessage("Please enter a note before saving.");
      return;
    }

    if (stress === undefined || isNaN(stress)) {
      setAlertMessage("Please enter your stress level (1–10).");
      return;
    }

    if (stress < 1 || stress > 10) {
      setAlertMessage("Stress level must be between 1 and 10.");
      return;
    }

    setSaving(true);
    setUploadProgress('Starting upload...');

    try {
      let photoUrl = null;

      // Upload photo with progress updates
      if (photoData) {
        setUploadProgress('Uploading photo to Cloudinary...');
        photoUrl = await uploadToCloudinary(photoData);
        
        if (!photoUrl) {
          setAlertMessage("Photo upload failed, but saving mood without photo...");
        } else {
          setUploadProgress('Photo uploaded successfully!');
        }
      }

      setUploadProgress('Saving mood entry...');

      const tempId = "temp_" + Date.now();
      const newEntry = {
        id: tempId,
        mood: selectedMood,
        note: note.trim(),
        stress,
        photoUrl,
        createdAt: new Date(),
        _synced: false,
        _pending: true
      };

      // 1. Save to local cache first
      const cacheKey = `moods_${userId}`;
      const cached = (await storage.get(cacheKey)) || [];
      await storage.set(cacheKey, [newEntry, ...cached]);

      // Reset form
      setSelectedMood(null);
      setNote("");
      setStress(undefined);
      setPhotoData(null);
      setUploadProgress('');

      // 2. Check online status
      if (!navigator.onLine) {
        setAlertMessage("Mood saved locally. It will sync when you're back online.");
        setSaving(false);
        return;
      }

      // 3. Save to Firestore with timeout
      setUploadProgress('Saving to cloud...');
      
      const firestoreData = {
        mood: selectedMood,
        note: note.trim(),
        stress,
        photoUrl,
        hasPhoto: !!photoUrl,
        createdAt: serverTimestamp(),
      };

      const firestorePromise = addDoc(collection(db, "users", userId, "mood_entries"), firestoreData);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Cloud save timeout after 15 seconds')), 15000);
      });

      await Promise.race([firestorePromise, timeoutPromise]);
      
      setAlertMessage(photoUrl ? "Mood with photo saved successfully! 🎉" : "Mood saved successfully!");

    } catch (err: any) {
      console.error("Save error:", err);
      
      const errorMessage = err.message || 'Unknown error occurred';
      
      if (!navigator.onLine || errorMessage.includes('timeout') || errorMessage.includes('network')) {
        setAlertMessage("Mood saved locally. It will sync when you're back online.");
      } else {
        setAlertMessage("Mood saved locally due to: " + errorMessage);
      }
    } finally {
      setSaving(false);
      setUploadProgress('');
    }
  };

  return (
    <div>
      <IonLabel>Select Your Mood</IonLabel>
      <IonGrid>
        <IonRow>
          {moodOptions.map((m) => (
            <IonCol key={m.label} size="2">
              <IonButton
                expand="block"
                color={selectedMood === m.label ? m.color : "light"}
                onClick={() => setSelectedMood(m.label)}
              >
                {m.emoji}
              </IonButton>
              <p style={{ textAlign: "center", fontSize: "12px" }}>{m.label}</p>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>

      <IonItem>
        <IonLabel position="stacked">Note:</IonLabel>
        <IonInput 
          value={note} 
          onIonChange={(e) => setNote(e.detail.value!)} 
        />
      </IonItem>

     <IonItem>
  <IonLabel position="stacked">Stress Level (1–10)</IonLabel>
  <IonInput
    type="number"
    min="1"
    max="10"
    value={stress}
    onIonInput={(e) => setStress(parseInt(e.detail.value!, 10))} // Change to onIonInput
  />
</IonItem>

      {/* Photo Section - UPDATED WITH CONTROLS */}
      <div style={{ margin: '20px 0' }}>
       <IonButton 
  expand="block" 
  color="primary"
  style={{
    background: 'var(--ion-color-primary)',
    color: 'var(--ion-color-primary-contrast)',
  }}
  onClick={handleTakePhoto}
  disabled={uploadingPhoto || saving}
>
  {uploadingPhoto ? <IonSpinner /> : '📷 Add Photo to Mood'}
</IonButton>


        {photoData && (
          <div style={{ textAlign: 'center', marginTop: '10px',width: '150px',
    height: '150px',
    margin: '0 auto 10px auto',
    borderRadius: '10px',
    border: '2px solid var(--ion-color-primary)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
 }}>
            <img 
              src={photoData} 
              alt="Mood photo preview" 
              style={{ 
                  width: '100%',
        height: '100%',
        objectFit: 'cover'

              }} 
            />
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress && (
          <IonText color="medium">
            <p style={{ textAlign: 'center', fontSize: '14px', margin: '10px 0' }}>
              {uploadProgress}
            </p>
          </IonText>
        )}
      </div>

      <IonButton 
        expand="block" 
        color="primary" 
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? <IonSpinner /> : 'Save Mood'}
      </IonButton>
{/* Refresh Button */}
<IonButton
  expand="block"
  style={{
    background: 'var(--ion-color-primary)',
    color: 'var(--ion-color-primary-contrast)',
  }}
  onClick={handleRefresh}
  disabled={saving}
>
🔄REFRESH
</IonButton>
      <IonAlert
        isOpen={alertMessage !== null}
        onDidDismiss={() => setAlertMessage(null)}
        header="Info"
        message={alertMessage || ""}
        buttons={["OK"]}
      />
    </div>
  );
}
