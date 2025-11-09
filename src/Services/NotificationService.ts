import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// Helper function to generate unique notification ID for each user
const getUserNotificationId = (userId: string): number => {
// Convert user ID to a number between 1000-9999
let hash = 0;
for (let i = 0; i < userId.length; i++) {
hash = ((hash << 5) - hash) + userId.charCodeAt(i);
hash = hash & hash; // Convert to 32bit integer
}
return Math.abs(hash) % 9000 + 1000; // Ensure ID between 1000-9999
};

// Helper function to get user-specific channel ID
const getUserChannelId = (userId: string) => `mood-reminders-${userId}`;

// User-specific channel creation
const createUserNotificationChannel = async (userId: string) => {
if (Capacitor.getPlatform() === 'android') {
try {
const CHANNEL_ID = getUserChannelId(userId);
console.log(`🔊 Creating notification channel for user: ${userId}`);

// Delete existing user channel
try {
await LocalNotifications.deleteChannel({ id: CHANNEL_ID });
console.log('🗑️ Old user channel deleted');
await new Promise(resolve => setTimeout(resolve, 200));
} catch (deleteError) {
console.log('ℹ️ No old user channel to delete');
}

// Create fresh channel for this user
await LocalNotifications.createChannel({
id: CHANNEL_ID,
name: 'MindBalance Reminders',
description: 'Personal daily mood reminders',
importance: 5,
vibration: true,
visibility: 1,
lights: true,
lightColor: '#FF0000',
sound: 'default'
});

console.log('✅ User notification channel created');

} catch (error) {
console.error('❌ Error creating user notification channel:', error);
}
}
};

// User-specific schedule function
export const scheduleDailyReminder = async (userId: string) => {
try {
console.log(`📅 Scheduling daily reminder for user: ${userId}`);

// Request permissions first
const permissionStatus = await LocalNotifications.requestPermissions();

if (permissionStatus.display !== 'granted') {
alert('❌ Please enable notifications in your device settings.');
return false;
}

// Create user-specific channel
await createUserNotificationChannel(userId);
await new Promise(resolve => setTimeout(resolve, 1000));

// Cancel any existing reminder for this user
const userNotificationId = getUserNotificationId(userId);
await LocalNotifications.cancel({
notifications: [{ id: userNotificationId }]
});

await new Promise(resolve => setTimeout(resolve, 300));

// Calculate time 2 minutes from now
const now = new Date();
const inTwoMinutes = new Date(now.getTime() + 120000);

const scheduledTime = inTwoMinutes.toLocaleTimeString([], {
hour: '2-digit',
minute: '2-digit'
});

console.log(`🎯 Scheduling for user ${userId} at:`, scheduledTime);

// Schedule with user-specific ID and channel
await LocalNotifications.schedule({
notifications: [
{
title: 'MindBalance Reminder 🔊',
body: 'Time to log your daily mood! 📊',
id: getUserNotificationId(userId), // User-specific ID
schedule: {
at: inTwoMinutes,
every: 'day'
},
channelId: getUserChannelId(userId), // User-specific channel
extra: {
redirectTo: 'addMood',
userId: userId // Store user ID in notification
},
smallIcon: 'ic_stat_icon',
iconColor: '#FF0000',
sound: 'default',
}
]
});

// Wait for scheduling to complete
await new Promise(resolve => setTimeout(resolve, 1000));

// Verify the notification was scheduled
const pending = await LocalNotifications.getPending();
const userNotificationIdCheck = getUserNotificationId(userId);
const isScheduled = pending.notifications.some(notif => notif.id === userNotificationIdCheck);

if (isScheduled) {
alert(`✅ Daily reminder scheduled for you!\n\nFirst notification in 2 minutes (at ${scheduledTime}), then daily at that time.`);
} else {
alert('❌ Failed to schedule. Try "Cancel All" first.');
}

return isScheduled;
} catch (error) {
console.error('❌ Notification scheduling failed:', error);
alert('Failed to schedule: ' + error);
return false;
}
};

// Cancel only current user's notifications
export const cancelUserNotifications = async (userId: string) => {
try {
console.log(`🗑️ Cancelling notifications for user: ${userId}`);

const userNotificationId = getUserNotificationId(userId);
await LocalNotifications.cancel({
notifications: [{ id: userNotificationId }]
});

await new Promise(resolve => setTimeout(resolve, 500));
const pending = await LocalNotifications.getPending();

const userNotifications = pending.notifications.filter(
notif => notif.extra?.userId === userId || notif.id === getUserNotificationId(userId)
);

if (userNotifications.length === 0) {
alert('✅ Your notifications cancelled!');
} else {
alert(`❌ Still ${userNotifications.length} of your notifications pending.`);
}

return true;
} catch (error) {
console.error('❌ Error cancelling notifications:', error);
alert('Error: ' + error);
return false;
}
};

// Get only current user's pending notifications
export const getUserPendingNotifications = async (userId: string) => {
try {
const pending = await LocalNotifications.getPending();

// Filter notifications for current user
const userNotifications = pending.notifications.filter(
notif => notif.extra?.userId === userId || notif.id === getUserNotificationId(userId)
);

console.log(`Pending notifications for user ${userId}:`, userNotifications);

if (userNotifications.length === 0) {
alert('📋 No pending notifications found for your account.\n\nThis is normal if:\n• Notification already fired today\n• Daily repeat is internally scheduled\n• Wait until later today or tomorrow morning and use "Check Scheduled" - you might see the next day notification as it gets closer to the trigger time.');
} else {
const notificationDetails = userNotifications.map(notif => {
let details = `Title: "${notif.title}"`;
if (notif.schedule?.at) {
const time = new Date(notif.schedule.at);
details += `, Time: ${time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
details += `, Date: ${time.toLocaleDateString()}`;
}
if (notif.schedule?.every) {
details += `, Repeats: ${notif.schedule.every}`;
}
return details;
}).join('\n');

alert(`📋 Found ${userNotifications.length} of your notification(s):\n\n${notificationDetails}`);
}

return userNotifications;
} catch (error) {
console.error('❌ Error getting user notifications:', error);
alert('Error getting your notifications: ' + error);
return [];
}
};

// Cancel ALL notifications (for logout or admin purposes)
export const cancelAllNotifications = async () => {
try {
console.log('🗑️ Cancelling ALL notifications for all users...');

// This will cancel all notifications regardless of user
const pending = await LocalNotifications.getPending();
const notificationsToCancel = pending.notifications.map(notif => ({ id: notif.id }));

await LocalNotifications.cancel({
notifications: notificationsToCancel
});

await new Promise(resolve => setTimeout(resolve, 500));
const remaining = await LocalNotifications.getPending();

if (remaining.notifications.length === 0) {
alert('✅ All notifications cancelled for all users!');
} else {
alert(`❌ Still ${remaining.notifications.length} notifications pending.`);
}

return true;
} catch (error) {
console.error('❌ Error cancelling all notifications:', error);
alert('Error: ' + error);
return false;
}
};

// Recreate channel for specific user
export const recreateChannelWithSound = async (userId: string) => {
if (Capacitor.getPlatform() === 'android') {
try {
console.log(`🔄 Force recreating channel for user: ${userId}`);

const CHANNEL_ID = getUserChannelId(userId);
await LocalNotifications.createChannel({
id: CHANNEL_ID,
name: 'MindBalance Reminders',
description: 'Personal daily mood reminders',
importance: 5,
vibration: true,
visibility: 1,
lights: true,
lightColor: '#FF0000',
sound: 'default'
});

console.log('✅ User channel recreated with sound');
alert('✅ Your notification channel recreated WITH SOUND!\n\nNow try scheduling again.');
return true;
} catch (error) {
console.error('❌ Error recreating user channel:', error);
alert('Error recreating your channel: ' + error);
return false;
}
}
return false;
};
