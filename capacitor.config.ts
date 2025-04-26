
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.quitarfondopro',
  appName: 'Quitar Fondo Pro',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    CapacitorCommunityAdmob: {
      androidApplicationId: 'ca-app-pub-1145055690439051~1234567890',
      iosApplicationId: 'ca-app-pub-1145055690439051~0987654321',
    }
  },
  server: {
    url: 'https://ea095a54-caed-4361-af79-53207c3ea09d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;

