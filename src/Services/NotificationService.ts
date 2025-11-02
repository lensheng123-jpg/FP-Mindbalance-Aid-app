import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// CHANGED: New channel ID to force recreation with proper sound
const CHANNEL_ID = 'mood-reminders-sound';

// Completely rewritten channel creation
const createNotificationChannel = async () => {
  if (Capacitor.getPlatform() === 'android') {
    try {
      console.log('🔊 Creating notification channel with sound...');
      
      // Use a completely new approach for sound
      await LocalNotifications.createChannel({
        id: CHANNEL_ID,
        name: 'Mood Reminders with Sound',
        description: 'Reminders for logging your daily mood with sound',
        importance: 5, // MAX importance - ensures sound plays
        sound: undefined, // CHANGED: Let Android use default sound
        vibration: true,
        visibility: 1, // Public
        lights: true,
        lightColor: '#FF0000',
        // CHANGED: Remove sound property and let system handle it
      });
      
      console.log('✅ Notification channel created with MAX importance');
      
      // Verify channel was created properly
      const channels = await LocalNotifications.listChannels();
      const ourChannel = channels.channels.find(ch => ch.id === CHANNEL_ID);
      console.log('🔊 Channel verification:', ourChannel);
      
    } catch (error) {
      console.error('❌ Error creating notification channel:', error);
    }
  }
};

export const scheduleDailyReminder = async () => {
  try {
    console.log('📅 Attempting to schedule daily reminder...');
    
    // Request permissions first
    const permissionStatus = await LocalNotifications.requestPermissions();
    
    if (permissionStatus.display !== 'granted') {
      alert('Please enable notifications in your device settings to use reminder features.');
      return false;
    }

    // Create channel for Android
    await createNotificationChannel();

    // Schedule new reminder - CHANGED: Remove sound property
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'MindBalance Reminder 🔊',
          body: 'Time to log your daily mood! 📊',
          id: 1,
          schedule: { 
            every: 'day',
            on: { hour: 19, minute: 0 }
          },
          // CHANGED: Remove sound property - let channel handle it
          channelId: CHANNEL_ID,
          extra: {
            redirectTo: 'addMood'
          },
          smallIcon: 'ic_stat_icon', // Make sure this exists
          iconColor: '#FF0000'
        }
      ]
    });
    
    alert('✅ Daily reminder scheduled for 7 PM!');
    return true;
  } catch (error) {
    console.error('❌ Notification scheduling failed:', error);
    alert('Failed to schedule reminder: ' + error);
    return false;
  }
};

export const testNotification = async () => {
  try {
    console.log('🔔 Testing notification with sound...');
    
    const permissionStatus = await LocalNotifications.requestPermissions();
    
    if (permissionStatus.display !== 'granted') {
      alert('Please enable notifications to test.');
      return false;
    }

    await createNotificationChannel();

    // CHANGED: Use different approach for sound
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Test Notification 🔊',
          body: 'You should hear sound and feel vibration!',
          id: 999,
          schedule: { at: new Date(Date.now() + 1000) }, // 1 second
          // CHANGED: No sound property - rely on channel configuration
          channelId: CHANNEL_ID,
          extra: { test: true },
          smallIcon: 'ic_stat_icon',
          iconColor: '#FF0000'
        }
      ]
    });
    
    alert('✅ Test notification scheduled! Should appear in 1 second with sound.');
    return true;
  } catch (error) {
    console.error('❌ Test notification failed:', error);
    alert('Test notification failed: ' + error);
    return false;
  }
};

// NEW: Force recreate channel with sound
export const recreateChannelWithSound = async () => {
  if (Capacitor.getPlatform() === 'android') {
    try {
      console.log('🔄 Force recreating channel with sound...');
      
      // Try multiple channel creation approaches
      
      // Approach 1: Default sound
      await LocalNotifications.createChannel({
        id: 'mood-reminders-urgent',
        name: 'Mood Reminders URGENT',
        description: 'Urgent mood reminders with sound',
        importance: 5, // MAX
        sound: undefined, // Let system choose default
        vibration: true,
        visibility: 1,
        lights: true,
        lightColor: '#FF0000'
      });
      
      // Approach 2: With specific sound
      await LocalNotifications.createChannel({
        id: 'mood-reminders-alert',
        name: 'Mood Reminders ALERT',
        description: 'Alert mood reminders',
        importance: 5,
        vibration: true,
        visibility: 1,
        lights: true,
        lightColor: '#FF0000'
        // No sound property - system default
      });
      
      console.log('✅ Multiple channels created for sound testing');
      alert('✅ Notification channels recreated! Try test notification now.');
      return true;
    } catch (error) {
      console.error('❌ Error recreating channels:', error);
      alert('Error recreating channels: ' + error);
      return false;
    }
  }
  return false;
};

// Keep your existing cancellation and other functions...
export const cancelAllNotifications = async () => {
  try {
    console.log('🗑️ Cancelling all notifications...');
    
    // Simple approach that works
    await LocalNotifications.cancel({
      notifications: [{ id: 1 }, { id: 999 }]
    });
    
    alert('✅ All notifications cancelled!');
    return true;
  } catch (error) {
    console.error('❌ Error cancelling notifications:', error);
    
    if (error instanceof Error && error.message.includes('notifications array')) {
      alert('✅ No notifications were scheduled to cancel.');
      return true;
    } else {
      alert('Error: ' + (error instanceof Error ? error.message : String(error)));
      return false;
    }
  }
};

export const getPendingNotifications = async () => {
  try {
    const pending = await LocalNotifications.getPending();
    console.log('Pending notifications:', pending.notifications);
    
    if (pending.notifications.length === 0) {
      alert('📋 No pending notifications found.');
    } else {
      const notificationDetails = pending.notifications.map(notif => 
        `ID: ${notif.id}, Title: ${notif.title}`
      ).join('\n');
      
      alert(`📋 Found ${pending.notifications.length} pending notification(s):\n\n${notificationDetails}`);
    }
    
    return pending.notifications;
  } catch (error) {
    console.error('❌ Error getting pending notifications:', error);
    alert('Error getting pending notifications: ' + error);
    return [];
  }
};

export const checkNotificationSettings = async () => {
  try {
    const channels = await LocalNotifications.listChannels();
    const permissions = await LocalNotifications.checkPermissions();
    const pending = await LocalNotifications.getPending();
    
    console.log('🔧 ALL Notification Channels:');
    channels.channels.forEach(channel => {
      console.log(`- ${channel.id}: ${channel.name} (Importance: ${channel.importance})`);
    });
    
    return {
      channels: channels.channels,
      permissions,
      pending: pending.notifications,
      platform: Capacitor.getPlatform(),
    };
  } catch (error) {
    console.error('Error checking notification settings:', error);
    return null;
  }
};