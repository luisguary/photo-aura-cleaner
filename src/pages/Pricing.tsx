
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const PricingPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const plans = [
    {
      title: "1 Día Premium",
      price: "$1 USD",
      benefits: [
        "Acceso completo a todas las funciones premium",
        "Descargas sin marca de agua",
        "Mejoras ilimitadas con IA por 24 horas"
      ],
      buttonText: "Comprar",
      highlight: false
    },
    {
      title: "30 Días Premium",
      price: "$3 USD",
      benefits: [
        "Acceso a todas las funciones premium por 30 días",
        "Descargas ilimitadas en alta calidad sin anuncios",
        "Uso ilimitado de la IA para mejorar imágenes"
      ],
      buttonText: "Comprar",
      highlight: true
    },
    {
      title: "12 Meses Premium",
      price: "$10 USD",
      benefits: [
        "Acceso total por 12 meses",
        "Prioridad en futuras actualizaciones",
        "Funcionalidades ilimitadas de IA sin restricciones"
      ],
      buttonText: "Comprar",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#1A1F2C] transition-colors duration-200 p-2 sm:p-4 md:p-8 relative">
      <motion.button
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          duration: 0.4
        }}
        className="absolute top-4 sm:top-8 md:top-16 left-2 sm:left-4 md:left-8 z-50 bg-gray-100 dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
      >
        <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
      </motion.button>

      <div className="max-w-6xl mx-auto pt-10 sm:pt-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-gray-900 dark:text-white">
          Planes Premium
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden ${plan.highlight ? 'border-2 border-primary shadow-xl' : ''}`}>
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-xs sm:text-sm font-medium rounded-bl-lg">
                    Popular
                  </div>
                )}
                <CardHeader className="py-4 sm:py-6">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                    {plan.title}
                  </CardTitle>
                  <CardDescription className="text-center text-xl sm:text-2xl md:text-3xl font-bold mt-2 sm:mt-4">
                    {plan.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6">
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.benefits.map((benefit, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + idx * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-4 sm:mt-6 hover:scale-105 transition-transform text-xs sm:text-sm"
                    variant={plan.highlight ? "default" : "outline"}
                    size={isMobile ? "sm" : "default"}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
