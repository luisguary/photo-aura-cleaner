import React from 'react';
import { Settings as SettingsIcon, Share, X } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";

const APP_VERSION = "1.0.4";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export function Settings({ open, onOpenChange }: SettingsProps) {
  const { language, setLanguage } = useSettingsStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: t('appTitle'),
      text: '¡Descubre Quitar Fondo Pro! Elimina fondos de imágenes fácilmente. Descárgala ahora.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({
          title: t('linkCopied'),
          description: t('linkCopiedDescription'),
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-md">
        <AlertDialogHeader className="relative">
          <AlertDialogTitle className="text-xl mb-4">{t('settings')}</AlertDialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">{t('language')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setLanguage(lang.code as any)}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleShare}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              {t('shareApp')}
            </Button>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t">
            <span>{t('appVersion')}</span>
            <span>v{APP_VERSION}</span>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
