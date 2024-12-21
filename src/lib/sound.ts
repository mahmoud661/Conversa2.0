class SoundManager {
  private messageSound: HTMLAudioElement;
  private notificationSound: HTMLAudioElement;

  constructor() {
    this.messageSound = new Audio('data:audio/mpeg;base64,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0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh//uSZESAFEFJ1eNPLHAAADSAAAAEVkknV4y8scAAANIAAAARh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0Yf/7kmRAj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    this.notificationSound = new Audio('data:audio/mpeg;base64,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h5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh//uSZESAFEFJ1eNPLHAAADSAAAAEVkknV4y8scAAANIAAAARh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0YeZTRh5lNGHmU0Yf/7kmRAj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
  }

  playMessageSound() {
    this.messageSound.currentTime = 0;
    this.messageSound.play().catch(() => {});
  }

  playNotificationSound() {
    this.notificationSound.currentTime = 0;
    this.notificationSound.play().catch(() => {});
  }
}

export const sounds = new SoundManager();