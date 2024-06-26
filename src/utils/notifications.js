import PushNotification from 'react-native-push-notification';

export const scheduleNotification = task => {
  const [hour, minute] = task.dueTime.split(':').map(Number);
  const dueDate = new Date();
  dueDate.setHours(hour, minute, 0, 0);

  PushNotification.localNotificationSchedule({
    message: `Task ${task.title} is due now!`,
    date: dueDate,
    playSound: true,
    soundName: 'default',
    userInfo: {taskId: task.id},
  });
};
