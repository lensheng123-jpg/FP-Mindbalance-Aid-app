import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot,orderBy,query} from "firebase/firestore";
import { db } from "../firebaseConfig";
import storage from "../Storage";
import {LineChart,Line,XAxis, YAxis, Tooltip,CartesianGrid, ResponsiveContainer} from "recharts";
import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  createdAt: any;
  stress: number;
}

interface Props {
  userId: string;
}

type ViewMode = "daily" | "weekly" | "monthly";

export default function StressTrendChart({ userId }: Props) {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  useEffect(() => {
    const cacheKey = `moods_${userId}`;
    storage.get(cacheKey).then((cached) => {
      if (cached) setMoods(cached);
    });

    const q = query(
      collection(db, "users", userId, "mood_entries"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as MoodEntry)
        );
        setMoods(data);
        setLoading(false);
        storage.set(cacheKey, data).catch(console.error);
      },
      (error) => {
        console.error("Error fetching moods:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [userId]);

  //Aggregation logic
  const aggregatedData = useMemo(() => {
    const grouped: Record<string, { total: number; count: number }> = {};

    moods.forEach((entry) => {
      if (!entry.createdAt?.seconds || !entry.stress) return;

      const d = new Date(entry.createdAt.seconds * 1000);
      let key: string;

      if (viewMode === "daily") {
        key = d.toLocaleDateString();
      } else if (viewMode === "weekly") {
        // Use Year + Week Number
        const firstDay = new Date(d.getFullYear(), 0, 1);
        const weekNum = Math.ceil(
          ((d.getTime() - firstDay.getTime()) / 86400000 + firstDay.getDay() + 1) / 7
        );
        key = `${d.getFullYear()}-W${weekNum}`;
      } else {
        // Monthly: Year + Month name
        key = `${d.getFullYear()}-${d.toLocaleString("default", { month: "short" })}`;
      }

      if (!grouped[key]) {
        grouped[key] = { total: 0, count: 0 };
      }
      grouped[key].total += entry.stress;
      grouped[key].count += 1;
    });

    return Object.keys(grouped)
      .map((key) => ({
        period: key,
        avgStress: +(grouped[key].total / grouped[key].count).toFixed(2),
      }))
      .sort(
        (a, b) =>
          new Date(a.period).getTime() - new Date(b.period).getTime()
      );
  }, [moods, viewMode]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading stress data...</p>;
  if (aggregatedData.length === 0) return <p style={{ textAlign: "center", opacity: 0.7 }}>No stress data yet.</p>;

  return (
    <div style={{ width: "100%", marginTop: "2rem" }}>
      <h3 style={{ textAlign: "center", marginBottom: "0.5rem" }}>📈 Average Stress ({viewMode})</h3>

      {/* Toggle */}
      <IonSegment
        value={viewMode}
        onIonChange={(e) => setViewMode(e.detail.value as ViewMode)}
      >
        <IonSegmentButton value="daily">
          <IonLabel>Daily</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="weekly">
          <IonLabel>Weekly</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="monthly">
          <IonLabel>Monthly</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {/* Chart */}
      <div style={{ width: "100%", height: 300, marginTop: "1rem" }}>
        <ResponsiveContainer>
       <LineChart data={aggregatedData} margin = {{ top: 10, right: 50, left: -10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis domain={[1, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="avgStress" stroke="#e63946" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
