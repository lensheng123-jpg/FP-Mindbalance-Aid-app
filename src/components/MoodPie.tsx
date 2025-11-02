import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, query, orderBy} from "firebase/firestore";
import storage from "../Storage";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend} from "recharts";
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

const COLORS: Record<string, string> = {
  Happy: "#4caf50",   // green
  Calm: "#00bcd4",    // cyan
  Tired: "#ffc107",   // amber
  Sad: "#2196f3",     // blue
  Angry: "#f44336"    // red
};

export default function MoodPie({ userId }: Props) {
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
    const count: Record<string, number> = {};
    entries.forEach((e) => {
      count[e.mood] = (count[e.mood] || 0) + 1;
    });

    const chartData = Object.keys(count).map((mood) => ({
      name: mood,
      value: count[mood]
    }));

    setData(chartData);
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Mood Distribution</IonCardTitle>
      </IonCardHeader>
      <IonCardContent style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#999"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </IonCardContent>
    </IonCard>
  );
}
