import Sound from "react-native-sound";
import { Vibration } from "react-native";

// Enable playback even if device is in silent mode
Sound.setCategory("Playback");

let soundInstance: Sound | null = null;

const loadSound = (): Sound | null => {
  if (soundInstance) return soundInstance;

  try {
    soundInstance = new Sound("ring.mp3", Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log("Failed to load ring.mp3 from bundle:", error);
      }
    });
  } catch (err) {
    console.log("Error instantiating Sound:", err);
  }

  return soundInstance;
};

// Preload sound on startup
try {
  loadSound();
} catch {}

/**
 * Plays ring.mp3 when a notification arrives inside the active app.
 */
export const playNotificationSound = () => {
  try {
    Vibration.vibrate(80);
  } catch {}

  try {
    const sound = loadSound();
    if (sound) {
      sound.stop(() => {
        sound.play((success) => {
          if (!success) {
            console.log("Sound playback failed");
          }
        });
      });
    }
  } catch (err: any) {
    console.log("Error playing notification sound:", err?.message);
  }
};
