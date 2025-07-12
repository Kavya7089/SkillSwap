// Example: src/services/realtime.ts
import Pusher from 'pusher-js';

const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;

export const pusher = new Pusher(PUSHER_KEY, {
  cluster: 'your_cluster', // Replace with your Pusher cluster
});

export const subscribeToNotifications = (callback: (data: any) => void) => {
  const channel = pusher.subscribe('notifications');
  channel.bind('new_notification', callback);
};