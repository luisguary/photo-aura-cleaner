
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import { Settings as SettingsIcon } from "lucide-react";

const APP_VERSION = "1.0.4";

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

export function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useSettingsStore();

  const handleShare = async () => {
    const shareData = {
      title: 'Quitar Fondo Pro',
      text: '¡Descubre Quitar Fondo Pro! Elimina fondos de imágenes fácilmente. Descárgala ahora.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({
          title: "Link copiado",
          description: "El enlace ha sido copiado al portapapeles",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <SettingsIcon className="h-5 w-5" />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="w-full max-w-md">
          <AlertDialogHeader className="relative">
            <AlertDialogTitle className="text-xl mb-4">Configuración</AlertDialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogHeader>

          <div className="space-y-6">
            {/* Language Selection */}
            <div>
              <h3 className="font-medium mb-3">Idioma</h3>
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

            {/* Share App */}
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
                Compartir aplicación
              </Button>
            </div>

            {/* App Version */}
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t">
              <span>Versión de la aplicación</span>
              <span>v{APP_VERSION}</span>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
