
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.quitarfondopro',
  appName: 'Quitar Fondo Pro',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    CapacitorCommunityAdmob: {
      androidApplicationId: 'ca-app-pub-1145055690439051~8510004230',
      iosApplicationId: 'ca-app-pub-1145055690439051~8510004230',
    },
    // Agregamos configuración para los permisos de almacenamiento
    Filesystem: {
      readPermission: true,
      writePermission: true
    }
  },
  server: {
    url: 'https://ea095a54-caed-4361-af79-53207c3ea09d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
