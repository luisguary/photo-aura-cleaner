
import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface PermissionStatus {
  camera?: boolean;
  photos?: boolean;
}

export const useStoragePermission = () => {
  const { t } = useTranslation();
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>({});
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const checkAndRequestPermissions = useCallback(async (): Promise<boolean> => {
    // Si no estamos en una plataforma nativa, no necesitamos permisos
    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    setIsRequestingPermission(true);

    try {
      // Utilizamos Capacitor Plugin para solicitar permisos
      const { Filesystem } = await import('@capacitor/filesystem');
      
      // Verificar el permiso actual
      const permissionResult = await Filesystem.checkPermissions();
      
      if (permissionResult.publicStorage !== 'granted') {
        // Solicitar permisos
        const requestResult = await Filesystem.requestPermissions();
        
        if (requestResult.publicStorage !== 'granted') {
          toast({
            title: t('permissionRequired'),
            description: t('storagePermissionNeeded'),
            variant: "destructive"
          });
          setPermissionStatus({ photos: false });
          setIsRequestingPermission(false);
          return false;
        }
      }
      
      setPermissionStatus({ photos: true });
      setIsRequestingPermission(false);
      return true;
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      toast({
        title: t('error'),
        description: t('permissionRequestFailed'),
        variant: "destructive"
      });
      setIsRequestingPermission(false);
      return false;
    }
  }, [t]);

  return { 
    checkAndRequestPermissions, 
    permissionStatus, 
    isRequestingPermission 
  };
};
