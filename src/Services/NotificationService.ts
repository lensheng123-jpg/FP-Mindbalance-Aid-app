import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// Use a consistent channel ID
const CHANNEL_ID = 'mood-reminders-sound';

// FIXED: More aggressive channel creation
const createNotificationChannel = async () => {
  if (Capacitor.getPlatform() === 'android') {
    try {
      console.log('🔊 Ensuring notification channel with sound...');
      
      // First, try to delete existing channel to ensure clean state
      try {
        await LocalNotifications.deleteChannel({ id: CHANNEL_ID });
        console.log('🗑️ Old channel deleted');
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (deleteError) {
        console.log('ℹ️ No old channel to delete');
      }
      
      // Create fresh channel with MAX importance and sound
      await LocalNotifications.createChannel({
        id: CHANNEL_ID,
        name: 'Mood Reminders URGENT',
        description: 'Urgent mood reminders with sound',
        importance: 5, // MAX importance - THIS IS CRITICAL
        vibration: true,
        visibility: 1, // Public
        lights: true,
        lightColor: '#FF0000',
        sound: 'default' // Explicit sound
      });
      
      console.log('✅ Notification channel created WITH SOUND');
      
      // Test the channel immediately
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Channel Test 🔊',
            body: 'Testing sound channel!',
            id: 777,
            schedule: { at: new Date(Date.now() + 3000) }, // 3 seconds
            channelId: CHANNEL_ID,
            sound: 'default',
            smallIcon: 'ic_stat_icon'
          }
        ]
      });
      
    } catch (error) {
      console.error('❌ Error creating notification channel:', error);
    }
  }
};

// FIXED: Use exact time scheduling that actually works
export const scheduleDailyReminder = async () => {
  try {
    console.log('📅 Attempting to schedule daily reminder...');
    
    // Request permissions first
    const permissionStatus = await LocalNotifications.requestPermissions();
    
    if (permissionStatus.display !== 'granted') {
      alert('❌ Please enable notifications in your device settings.');
      return false;
    }

    // FIX: Recreate channel FIRST to ensure sound works
    await createNotificationChannel();
    
    // Wait for channel to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Cancel any existing reminder first
    await LocalNotifications.cancel({
      notifications: [{ id: 1 }]
    });

    // Calculate time 2 minutes from now
    const now = new Date();
    const inOneMinute = new Date(now.getTime() + 60000); // 1 minute
    
    const scheduledTime = inOneMinute.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // FIX: Use exact datetime for first notification + daily repeat
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'MindBalance Reminder 🔊',
          body: 'Time to log your daily mood! 📊',
          id: 1,
          schedule: { 
            at: inOneMinute, // Exact time for first notification
            every: 'day' // Repeat daily from that time
          },
          channelId: CHANNEL_ID,
          extra: {
            redirectTo: 'addMood'
          },
          smallIcon: 'ic_stat_icon',
          iconColor: '#FF0000',
          sound: 'default' // Explicitly set sound
        }
      ]
    });
    
    // Wait for scheduling to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify the notification was scheduled
    const pending = await LocalNotifications.getPending();
    const isScheduled = pending.notifications.some(notif => notif.id === 1);
    
    if (isScheduled) {
      alert(`✅ Daily reminder scheduled!\n\nFirst notification in 1 minute (at ${scheduledTime}), then daily at that same time.\n\n• Keep app open or in background\n• Check device volume\n• Wait exactly 1 minute`);
    } else {
      alert('❌ Failed to schedule. Try "Cancel All" first, then schedule again.');
    }
    
    return isScheduled;
  } catch (error) {
    console.error('❌ Notification scheduling failed:', error);
    alert('Failed to schedule: ' + error);
    return false;
  }
};

export const cancelAllNotifications = async () => {
  try {
    console.log('🗑️ Cancelling all notifications...');
    
    await LocalNotifications.cancel({
      notifications: [{ id: 1 }, { id: 777 }]
    });
    
    // Wait and verify
    await new Promise(resolve => setTimeout(resolve, 500));
    const pending = await LocalNotifications.getPending();
    
    if (pending.notifications.length === 0) {
      alert('✅ All notifications cancelled!');
    } else {
      alert(`❌ Still ${pending.notifications.length} notifications pending.`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error cancelling notifications:', error);
    alert('Error: ' + error);
    return false;
  }
};

export const getPendingNotifications = async () => {
  try {
    const pending = await LocalNotifications.getPending();
    console.log('Pending notifications:', pending.notifications);
    
    if (pending.notifications.length === 0) {
      alert('📋 No pending notifications found.');
    } else {
      const notificationDetails = pending.notifications.map(notif => {
        let details = `ID: ${notif.id}, Title: "${notif.title}"`;
        if (notif.schedule?.at) {
          const time = new Date(notif.schedule.at);
          details += `, Time: ${time.toLocaleTimeString()}`;
        }
        return details;
      }).join('\n');
      
      alert(`📋 Found ${pending.notifications.length} pending notification(s):\n\n${notificationDetails}`);
    }
    
    return pending.notifications;
  } catch (error) {
    console.error('❌ Error getting pending notifications:', error);
    alert('Error getting pending notifications: ' + error);
    return [];
  }
};

export const recreateChannelWithSound = async () => {
  if (Capacitor.getPlatform() === 'android') {
    try {
      console.log('🔄 Force recreating MAIN channel with sound...');
      
      await LocalNotifications.createChannel({
        id: CHANNEL_ID,
        name: 'Mood Reminders URGENT',
        description: 'Urgent mood reminders with sound',
        importance: 5,
        vibration: true,
        visibility: 1,
        lights: true,
        lightColor: '#FF0000',
        sound: 'default'
      });
      
      console.log('✅ MAIN channel recreated with sound:', CHANNEL_ID);
      alert('✅ Main notification channel recreated WITH SOUND!');
      return true;
    } catch (error) {
      console.error('❌ Error recreating main channel:', error);
      alert('Error recreating main channel: ' + error);
      return false;
    }
  }
  return false;
};
