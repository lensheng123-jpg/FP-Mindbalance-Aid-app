import { useEffect, useState } from "react";
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
  IonButton, IonSearchbar, IonSegment, IonSegmentButton, 
  IonLabel, IonAlert, IonImg, IonSpinner
} from "@ionic/react";
import { collection, onSnapshot, query, orderBy, updateDoc, deleteDoc, doc, getCountFromServer } from "firebase/firestore";
import { db } from "../firebaseConfig";
import storage from "../Storage";
import { useMonetization } from "../theme/MonetizationContext";
import { editPhoto } from "../theme/CameraService";

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  createdAt: any;
  stress: number;
  photoUrl?: string;
  hasPhoto?: boolean;
}

interface Props {
  userId: string;
}

const moodEmojis: Record<string, { emoji: string; color: string }> = {
  Happy: { emoji: "😄", color: "success" },
  Sad: { emoji: "😢", color: "medium" },
  Angry: { emoji: "😡", color: "danger" },
  Calm: { emoji: "😌", color: "tertiary" },
  Tired: { emoji: "😴", color: "warning" }
};

export default function MoodList({ userId }: Props) {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [totalMoodCount, setTotalMoodCount] = useState<number>(0);
  
  const { isPro } = useMonetization();
  const MOOD_LIMIT = 10;

  // Function to get total mood count
  const getTotalMoodCount = async () => {
    try {
      const coll = collection(db, "users", userId, "mood_entries");
      const snapshot = await getCountFromServer(coll);
      setTotalMoodCount(snapshot.data().count);
    } catch (error) {
      console.error("Error getting total mood count:", error);
    }
  };

  useEffect(() => {
    const cacheKey = `moods_${userId}`;

    // Load cached data first
    storage.get(cacheKey).then((cached) => {
      if (cached) {
        const limitedMoods = isPro ? cached : cached.slice(0, MOOD_LIMIT);
        setMoods(limitedMoods);
      }
    }).catch(console.error);

    // Set up real-time listener
    const q = query(
      collection(db, "users", userId, "mood_entries"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as MoodEntry)
        );
        
        // Apply limit for free users
        const limitedData = isPro ? data : data.slice(0, MOOD_LIMIT);
        setMoods(limitedData);
        setLoading(false);
        
        // Update cache with limited data for free users
        const cacheData = isPro ? data : limitedData;
        storage.set(cacheKey, cacheData).catch(console.error);
        
        // Get total count for display
        getTotalMoodCount();
        
        // Show alert if free user has more than limit
        if (!isPro && data.length > MOOD_LIMIT) {
          setShowLimitAlert(true);
        }
      },
      (error) => {
        console.error("Error fetching moods:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [userId, isPro]);

  // Check pending sync
  useEffect(() => {
    const checkPendingSync = async () => {
      const cacheKey = `moods_${userId}`;
      const cached = await storage.get(cacheKey);
      if (cached) {
        const pendingEntries = cached.filter((entry: any) => entry._pending && !entry._synced);
        if (pendingEntries.length > 0 && navigator.onLine) {
          console.log(`${pendingEntries.length} entries pending sync`);
        }
      }
    };

    checkPendingSync();
    
    const handleOnline = () => {
      checkPendingSync();
      console.log("Back online - checking for pending sync");
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [userId]);

  // Rest of your functions remain the same...
  const handleImageLoad = (moodId: string) => {
    setImageLoading(prev => ({
      ...prev,
      [moodId]: false
    }));
  };

  const handleImageError = (moodId: string) => {
    setImageLoading(prev => ({
      ...prev,
      [moodId]: false
    }));
    console.error(`Failed to load image for mood ${moodId}`);
  };

  const handleEditPhoto = async (id: string, currentPhotoUrl: string) => {
    try {
      const newPhotoUrl = await editPhoto(currentPhotoUrl);
      if (newPhotoUrl && newPhotoUrl !== currentPhotoUrl) {
        const docRef = doc(db, "users", userId, "mood_entries", id);
        await updateDoc(docRef, { 
          photoUrl: newPhotoUrl,
          hasPhoto: true 
        });
        setAlertMessage("Photo updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update photo:", error);
      setAlertMessage("Failed to update photo. Please try again.");
    }
  };

  const handleRemovePhoto = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this photo?")) {
      return;
    }

    try {
      const docRef = doc(db, "users", userId, "mood_entries", id);
      await updateDoc(docRef, { 
        photoUrl: null,
        hasPhoto: false 
      });
      setAlertMessage("Photo removed successfully!");
    } catch (error) {
      console.error("Failed to remove photo:", error);
      setAlertMessage("Failed to remove photo. Please try again.");
    }
  };

  const handleUpdate = async (id: string, currentNote: string) => {
    const newNote = prompt("Update your note:", currentNote);
    if (newNote !== null && newNote !== currentNote) {
      try {
        const docRef = doc(db, "users", userId, "mood_entries", id);
        await updateDoc(docRef, { note: newNote });
      } catch (error) {
        console.error("Failed to update note:", error);
        alert("Failed to update note. Please try again.");
      }
    }
  };

  const handleUpdateMood = async (id: string, currentMood: string) => {
    const moodKeys = Object.keys(moodEmojis);
    
    for (const mood of moodKeys) {
      if (window.confirm(`Change mood to ${moodEmojis[mood].emoji} ${mood}?`)) {
        if (mood !== currentMood) {
          try {
            const docRef = doc(db, "users", userId, "mood_entries", id);
            await updateDoc(docRef, { mood: mood });
          } catch (error) {
            console.error("Failed to update mood:", error);
            alert("Failed to update mood. Please try again.");
          }
        }
        break;
      }
    }
  };

  const handleUpdateStress = async (id: string, currentStress: number) => {
    const newStressStr = prompt("Update your stress level (1-10):", String(currentStress));
    
    if (newStressStr === null) return;
    
    const newStress = Number(newStressStr);
    
    if (!isNaN(newStress) && newStress >= 1 && newStress <= 10) {
      if (newStress !== currentStress) {
        try {
          const docRef = doc(db, "users", userId, "mood_entries", id);
          await updateDoc(docRef, { stress: newStress });
        } catch (error) {
          console.error("Failed to update stress level:", error);
          alert("Failed to update stress level. Please try again.");
        }
      }
    } else {
      alert("Please enter a valid number between 1 and 10.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this mood entry?")) {
      return;
    }

    const originalMoods = moods;
    setMoods(prev => prev.filter(m => m.id !== id));

    try {
      const cacheKey = `moods_${userId}`;
      const updatedMoods = originalMoods.filter(m => m.id !== id);
      await storage.set(cacheKey, updatedMoods);

      const docRef = doc(db, "users", userId, "mood_entries", id);
      await deleteDoc(docRef);
      
    } catch (error) {
      console.error("Failed to delete mood entry:", error);
      setMoods(originalMoods);
      alert("Failed to delete mood entry. Please check your connection and try again.");
    }
  };

  // Filter moods
  const filteredMoods = moods.filter((mood) => {
    const matchesSearch = !search ||
      mood.note?.toLowerCase().includes(search.toLowerCase()) ||
      mood.mood.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "All" ||
      mood.mood.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "Unknown date";
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>Loading moods...</div>;
  }

  return (
    <div>
      {/* Alert for photo operations */}
      <IonAlert
        isOpen={alertMessage !== null}
        onDidDismiss={() => setAlertMessage(null)}
        header="Photo Operation"
        message={alertMessage || ""}
        buttons={["OK"]}
      />

      {/* Mood History Limit Alert for Free Users - IMPROVED */}
      {!isPro && (
        <div style={{ 
          background: totalMoodCount > MOOD_LIMIT 
            ? 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)' 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '15px',
          borderRadius: '130px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          {totalMoodCount > MOOD_LIMIT ? (
            <>
              <p><strong>🔒 Mood History Limited</strong></p>
              <p>Free users can only view the last {MOOD_LIMIT} mood entries</p>
              <p>Upgrade to Pro for unlimited mood history!</p>
              <p><small>You have {totalMoodCount} total entries (showing first {MOOD_LIMIT})</small></p>
            </>
          ) : (
            <>
              <p><strong>📊 Free Account</strong></p>
              <p>You can view up to {MOOD_LIMIT} mood entries</p>
              <p>Upgrade to Pro for unlimited mood history!</p>
              <p><small>Currently showing {moods.length} of {MOOD_LIMIT} available entries</small></p>
            </>
          )}
        </div>
      )}

      {/* Show total count for Pro users */}
      {isPro && moods.length > 0 && (
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '15px',
          borderRadius: '130px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          <p><strong>✅ Unlimited Mood History Active</strong></p>
          <p>You have access to all {totalMoodCount} mood entries</p>
        </div>
      )}

      <IonSearchbar
        placeholder="Search moods or notes..."
        value={search}
        onIonInput={(e) => setSearch(e.detail.value!)}
      />

      <IonSegment
        value={filter}
        onIonChange={(e) => setFilter(e.detail.value as string)}
        scrollable
      >
        <IonSegmentButton value="All">
          <IonLabel>All</IonLabel>
        </IonSegmentButton>
        {Object.keys(moodEmojis).map((mood) => (
          <IonSegmentButton key={mood} value={mood}>
            <IonLabel>{moodEmojis[mood].emoji} {mood}</IonLabel>
          </IonSegmentButton>
        ))}
      </IonSegment>

      {filteredMoods.length > 0 ? (
        filteredMoods.map((mood) => {
          const moodMeta = moodEmojis[mood.mood] || { emoji: "❓", color: "light" };
          
          return (
            <IonCard key={mood.id} color={moodMeta.color}>
              <IonCardHeader>
                <IonCardTitle>
                  {moodMeta.emoji} {mood.mood}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {/* Photo Display Section */}
                {mood.photoUrl && (
                  <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '15px'
                  }}>
                    {imageLoading[mood.id] && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '150px',
                        height: '150px',
                        background: '#f5f5f5',
                        borderRadius: '10px',
                        margin: '0 auto 10px auto'
                      }}>
                        <IonSpinner />
                      </div>
                    )}
                    
                    <div style={{
                      display: imageLoading[mood.id] ? 'none' : 'block',
                      width: '150px',
                      height: '150px',
                      borderRadius: '10px',
                      margin: '0 auto 10px auto',
                      border: '2px solid var(--ion-color-primary)',
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5'
                    }}>
                      <IonImg
                        src={mood.photoUrl}
                        alt="Mood photo"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onIonImgDidLoad={() => handleImageLoad(mood.id)}
                        onIonError={() => handleImageError(mood.id)}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <IonButton 
                        size="small" 
                        color="warning"
                        onClick={() => handleEditPhoto(mood.id, mood.photoUrl!)}
                      >
                        Edit Photo
                      </IonButton>
                      <IonButton 
                        size="small" 
                        color="danger"
                        onClick={() => handleRemovePhoto(mood.id)}
                      >
                        Remove Photo
                      </IonButton>
                    </div>
                  </div>
                )}

                <p><strong>Note:</strong> {mood.note || "No note added"}</p>
                <p><strong>Stress Level:</strong> {mood.stress}/10</p>
                <p style={{ fontSize: "12px", opacity: 0.8 }}>
                  Logged at: {formatDate(mood.createdAt)}
                </p>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "1rem" }}>
                  <IonButton color="light" size="small" 
                    onClick={() => handleUpdate(mood.id, mood.note)}>
                    Edit Note
                  </IonButton>
                  <IonButton color="light" size="small" 
                    onClick={() => handleUpdateStress(mood.id, mood.stress)}>
                    Update Stress
                  </IonButton>
                  <IonButton color="light" size="small" 
                    onClick={() => handleUpdateMood(mood.id, mood.mood)}>
                    Edit Mood
                  </IonButton>
                  <IonButton color="light" size="small" 
                    onClick={() => handleDelete(mood.id)}>
                    Delete
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          );
        })
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem", opacity: 0.7 }}>
          {moods.length === 0 ? "No mood entries yet." : "No moods match your search."}
        </p>
      )}

      {/* Alert for when free user reaches limit */}
      <IonAlert
        isOpen={showLimitAlert}
        onDidDismiss={() => setShowLimitAlert(false)}
        header="Mood History Limited"
        message={`Free users can only view the last ${MOOD_LIMIT} mood entries. You have ${totalMoodCount} total entries. Upgrade to Pro for unlimited access to your complete mood history!`}
        buttons={[
          {
            text: 'Upgrade to Pro',
            handler: () => {
              console.log('Navigate to upgrade page');
            }
          },
          {
            text: 'OK',
            role: 'cancel'
          }
        ]}
      />
    </div>
  );
}