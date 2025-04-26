
export type TranslationKey =
  | 'appTitle'
  | 'settings'
  | 'language'
  | 'shareApp'
  | 'appVersion'
  | 'selectImage'
  | 'dropImageHere'
  | 'orClickToSelect'
  | 'fixBlurryPhoto'
  | 'processingImage'
  | 'enhancingImage'
  | 'success'
  | 'imageEnhanced'
  | 'error'
  | 'failedToProcess'
  | 'watchAd'
  | 'becomePremium'
  | 'fixBlurryPhotoAI'
  | 'watchAdToUse'
  | 'watchAdToFix'
  | 'becomePremiumUser'
  | 'loadingAd'
  | 'pleaseWait'
  | 'linkCopied'
  | 'linkCopiedDescription';

export interface Translations {
  [key: string]: {
    [key in TranslationKey]: string;
  };
}

export const translations: Translations = {
  es: {
    appTitle: 'Quitar Fondo Pro',
    settings: 'Configuración',
    language: 'Idioma',
    shareApp: 'Compartir aplicación',
    appVersion: 'Versión de la aplicación',
    selectImage: 'Seleccionar Imagen',
    dropImageHere: 'Arrastra una imagen aquí',
    orClickToSelect: 'o haz clic para seleccionar',
    fixBlurryPhoto: 'Arreglar Foto Borrosa',
    processingImage: 'Procesando imagen...',
    enhancingImage: 'Mejorando la nitidez de tu imagen con inteligencia artificial...',
    success: '¡Éxito!',
    imageEnhanced: 'Tu imagen ha sido mejorada',
    error: 'Error',
    failedToProcess: 'Error al procesar la imagen. Por favor, inténtalo de nuevo.',
    watchAd: 'Ver un anuncio',
    becomePremium: 'Hazte Premium',
    fixBlurryPhotoAI: 'Arreglar Foto Borrosa con IA',
    watchAdToUse: 'Ver un anuncio para usar esta función, o hazte Premium.',
    watchAdToFix: 'Ver anuncio para arreglar foto',
    becomePremiumUser: 'Hazte usuario Premium',
    loadingAd: 'Cargando anuncio...',
    pleaseWait: 'Por favor, espera mientras se carga el anuncio',
    linkCopied: 'Enlace copiado',
    linkCopiedDescription: 'El enlace ha sido copiado al portapapeles'
  },
  en: {
    appTitle: 'Background Remover Pro',
    settings: 'Settings',
    language: 'Language',
    shareApp: 'Share app',
    appVersion: 'App version',
    selectImage: 'Select Image',
    dropImageHere: 'Drop image here',
    orClickToSelect: 'or click to select',
    fixBlurryPhoto: 'Fix Blurry Photo',
    processingImage: 'Processing image...',
    enhancingImage: 'Enhancing image sharpness with AI...',
    success: 'Success!',
    imageEnhanced: 'Your image has been enhanced',
    error: 'Error',
    failedToProcess: 'Failed to process the image. Please try again.',
    watchAd: 'Watch an ad',
    becomePremium: 'Become Premium',
    fixBlurryPhotoAI: 'Fix Blurry Photo with AI',
    watchAdToUse: 'Watch an ad to use this feature, or become a Premium user.',
    watchAdToFix: 'Watch ad to fix photo',
    becomePremiumUser: 'Become Premium user',
    loadingAd: 'Loading ad...',
    pleaseWait: 'Please wait while the ad loads',
    linkCopied: 'Link copied',
    linkCopiedDescription: 'The link has been copied to the clipboard'
  },
  pt: {
    appTitle: 'Remover Fundo Pro',
    settings: 'Configurações',
    language: 'Idioma',
    shareApp: 'Compartilhar aplicativo',
    appVersion: 'Versão do aplicativo',
    selectImage: 'Selecionar Imagem',
    dropImageHere: 'Arraste uma imagem aqui',
    orClickToSelect: 'ou clique para selecionar',
    fixBlurryPhoto: 'Corrigir Foto Desfocada',
    processingImage: 'Processando imagem...',
    enhancingImage: 'Melhorando a nitidez da sua imagem com IA...',
    success: 'Sucesso!',
    imageEnhanced: 'Sua imagem foi aprimorada',
    error: 'Erro',
    failedToProcess: 'Falha ao processar a imagem. Por favor, tente novamente.',
    watchAd: 'Assistir um anúncio',
    becomePremium: 'Torne-se Premium',
    fixBlurryPhotoAI: 'Corrigir Foto Desfocada com IA',
    watchAdToUse: 'Assista a um anúncio para usar esse recurso ou torne-se Premium.',
    watchAdToFix: 'Assistir anúncio para corrigir foto',
    becomePremiumUser: 'Torne-se usuário Premium',
    loadingAd: 'Carregando anúncio...',
    pleaseWait: 'Por favor, aguarde enquanto o anúncio carrega',
    linkCopied: 'Link copiado',
    linkCopiedDescription: 'O link foi copiado para a área de transferência'
  },
  fr: {
    appTitle: 'Suppression d\'Arrière-plan Pro',
    settings: 'Paramètres',
    language: 'Langue',
    shareApp: 'Partager l\'application',
    appVersion: 'Version de l\'application',
    selectImage: 'Sélectionner une Image',
    dropImageHere: 'Déposez une image ici',
    orClickToSelect: 'ou cliquez pour sélectionner',
    fixBlurryPhoto: 'Corriger Photo Floue',
    processingImage: 'Traitement de l\'image...',
    enhancingImage: 'Amélioration de la netteté de votre image avec l\'IA...',
    success: 'Succès!',
    imageEnhanced: 'Votre image a été améliorée',
    error: 'Erreur',
    failedToProcess: 'Échec du traitement de l\'image. Veuillez réessayer.',
    watchAd: 'Regarder une publicité',
    becomePremium: 'Devenir Premium',
    fixBlurryPhotoAI: 'Corriger Photo Floue avec IA',
    watchAdToUse: 'Regardez une publicité pour utiliser cette fonctionnalité, ou devenez Premium.',
    watchAdToFix: 'Regarder une publicité pour corriger la photo',
    becomePremiumUser: 'Devenir utilisateur Premium',
    loadingAd: 'Chargement de la publicité...',
    pleaseWait: 'Veuillez patienter pendant le chargement de la publicité',
    linkCopied: 'Lien copié',
    linkCopiedDescription: 'Le lien a été copié dans le presse-papiers'
  },
  de: {
    appTitle: 'Hintergrund-Entferner Pro',
    settings: 'Einstellungen',
    language: 'Sprache',
    shareApp: 'App teilen',
    appVersion: 'App-Version',
    selectImage: 'Bild auswählen',
    dropImageHere: 'Bild hier ablegen',
    orClickToSelect: 'oder klicken zum Auswählen',
    fixBlurryPhoto: 'Unscharfes Foto korrigieren',
    processingImage: 'Bild wird verarbeitet...',
    enhancingImage: 'Bildschärfe wird mit KI verbessert...',
    success: 'Erfolgreich!',
    imageEnhanced: 'Ihr Bild wurde verbessert',
    error: 'Fehler',
    failedToProcess: 'Fehler bei der Verarbeitung des Bildes. Bitte versuchen Sie es erneut.',
    watchAd: 'Werbung ansehen',
    becomePremium: 'Premium werden',
    fixBlurryPhotoAI: 'Unscharfes Foto mit KI korrigieren',
    watchAdToUse: 'Sehen Sie eine Werbung an, um diese Funktion zu nutzen, oder werden Sie Premium-Nutzer.',
    watchAdToFix: 'Werbung ansehen, um Foto zu korrigieren',
    becomePremiumUser: 'Premium-Nutzer werden',
    loadingAd: 'Werbung wird geladen...',
    pleaseWait: 'Bitte warten Sie, während die Werbung geladen wird',
    linkCopied: 'Link kopiert',
    linkCopiedDescription: 'Der Link wurde in die Zwischenablage kopiert'
  },
  it: {
    appTitle: 'Rimuovi Sfondo Pro',
    settings: 'Impostazioni',
    language: 'Lingua',
    shareApp: 'Condividi app',
    appVersion: 'Versione app',
    selectImage: 'Seleziona Immagine',
    dropImageHere: 'Trascina un\'immagine qui',
    orClickToSelect: 'o clicca per selezionare',
    fixBlurryPhoto: 'Correggi Foto Sfocata',
    processingImage: 'Elaborazione immagine...',
    enhancingImage: 'Miglioramento della nitidezza dell\'immagine con IA...',
    success: 'Successo!',
    imageEnhanced: 'La tua immagine è stata migliorata',
    error: 'Errore',
    failedToProcess: 'Impossibile elaborare l\'immagine. Per favore riprova.',
    watchAd: 'Guarda un annuncio',
    becomePremium: 'Diventa Premium',
    fixBlurryPhotoAI: 'Correggi Foto Sfocata con IA',
    watchAdToUse: 'Guarda un annuncio per utilizzare questa funzione o diventa Premium.',
    watchAdToFix: 'Guarda un annuncio per correggere la foto',
    becomePremiumUser: 'Diventa utente Premium',
    loadingAd: 'Caricamento annuncio...',
    pleaseWait: 'Attendi mentre l\'annuncio viene caricato',
    linkCopied: 'Link copiato',
    linkCopiedDescription: 'Il link è stato copiato negli appunti'
  },
  hi: {
    appTitle: 'बैकग्राउंड हटानेवाला प्रो',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    shareApp: 'ऐप शेयर करें',
    appVersion: 'ऐप वर्शन',
    selectImage: 'छवि चुनें',
    dropImageHere: 'यहां छवि ड्रॉप करें',
    orClickToSelect: 'या चुनने के लिए क्लिक करें',
    fixBlurryPhoto: 'धुंधली फोटो ठीक करें',
    processingImage: 'छवि संसाधित हो रही है...',
    enhancingImage: 'एआई के साथ छवि की स्पष्टता बढ़ाई जा रही है...',
    success: 'सफलता!',
    imageEnhanced: 'आपकी छवि बेहतर बना दी गई है',
    error: 'त्रुटि',
    failedToProcess: 'छवि को संसाधित करने में विफल। कृपया पुन: प्रयास करें।',
    watchAd: 'विज्ञापन देखें',
    becomePremium: 'प्रीमियम बनें',
    fixBlurryPhotoAI: 'एआई के साथ धुंधली फोटो ठीक करें',
    watchAdToUse: 'इस सुविधा का उपयोग करने के लिए एक विज्ञापन देखें, या प्रीमियम बनें।',
    watchAdToFix: 'फोटो ठीक करने के लिए विज्ञापन देखें',
    becomePremiumUser: 'प्रीमियम उपयोगकर्ता बनें',
    loadingAd: 'विज्ञापन लोड हो रहा है...',
    pleaseWait: 'कृपया प्रतीक्षा करें जबकि विज्ञापन लोड हो रहा है',
    linkCopied: 'लिंक कॉपी किया गया',
    linkCopiedDescription: 'लिंक क्लिपबोर्ड पर कॉपी किया गया है'
  },
  ar: {
    appTitle: 'مزيل الخلفية برو',
    settings: 'الإعدادات',
    language: 'اللغة',
    shareApp: 'مشاركة التطبيق',
    appVersion: 'إصدار التطبيق',
    selectImage: 'اختر صورة',
    dropImageHere: 'اسحب الصورة هنا',
    orClickToSelect: 'أو انقر للاختيار',
    fixBlurryPhoto: 'إصلاح الصورة الضبابية',
    processingImage: 'جاري معالجة الصورة...',
    enhancingImage: 'تحسين وضوح صورتك باستخدام الذكاء الاصطناعي...',
    success: 'نجاح!',
    imageEnhanced: 'تم تحسين صورتك',
    error: 'خطأ',
    failedToProcess: 'فشل في معالجة الصورة. يرجى المحاولة مرة أخرى.',
    watchAd: 'مشاهدة إعلان',
    becomePremium: 'كن مميزًا',
    fixBlurryPhotoAI: 'إصلاح الصورة الضبابية بالذكاء الاصطناعي',
    watchAdToUse: 'شاهد إعلانًا لاستخدام هذه الميزة، أو كن مستخدمًا مميزًا.',
    watchAdToFix: 'مشاهدة إعلان لإصلاح الصورة',
    becomePremiumUser: 'كن مستخدمًا مميزًا',
    loadingAd: 'جاري تحميل الإعلان...',
    pleaseWait: 'يرجى الانتظار أثناء تحميل الإعلان',
    linkCopied: 'تم نسخ الرابط',
    linkCopiedDescription: 'تم نسخ الرابط إلى الحافظة'
  }
};
