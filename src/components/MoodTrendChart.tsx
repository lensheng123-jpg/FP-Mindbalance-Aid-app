import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {  collection, onSnapshot, query, orderBy} from "firebase/firestore";
import storage from "../Storage";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer} from "recharts";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/react";

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  createdAt: any;
}

interface Props {
  userId: string;
}

const moodScores: Record<string, number> = {
  Happy: 5,
  Calm: 4,
  Tired: 3,
  Sad: 2,
  Angry: 1
};

export default function MoodtrendChart({ userId }: Props) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const cacheKey = `moods_${userId}`;
    storage.get(cacheKey).then((cached) => {
      if (cached) processData(cached);
    });

    const q = query(
      collection(db, "users", userId, "mood_entries"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const moods = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as MoodEntry)
      );
      processData(moods);
      storage.set(cacheKey, moods);
    });

    return () => unsub();
  }, [userId]);

  const processData = (entries: MoodEntry[]) => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString("en-US", { weekday: "short" });
    });

    const grouped: Record<string, number[]> = {};
    last7Days.forEach((day) => (grouped[day] = []));

    entries.forEach((e) => {
  if (!e.createdAt || !e.createdAt.seconds) {
    return; // skip entries without valid timestamp
  }

  const date = new Date(e.createdAt.seconds * 1000);
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  if (grouped[day]) {
    grouped[day].push(moodScores[e.mood] || 0);
  }
});


    const chartData = last7Days.map((day) => ({
      day,
      mood:
        grouped[day].length > 0
          ? grouped[day].reduce((a, b) => a + b, 0) / grouped[day].length
          : null
    }));

    setData(chartData);
  };

  
return (
  <IonCard>
    <IonCardHeader>
      <IonCardTitle>Mood Trends (Last 7 Days)</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>
      <div style={{ width: "100%", height: "250px", padding: 0, margin: 0 }}>
        <ResponsiveContainer>
          <LineChart 
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid stroke="#ccc" />
            <XAxis 
              dataKey="day" 
              tickMargin={5}
            />
            <YAxis 
              domain={[0, 5]} 
              ticks={[1, 2, 3, 4, 5]} 
              width={30}
            />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#4cafef" 
              strokeWidth={3} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </IonCardContent>
  </IonCard>
);

}
