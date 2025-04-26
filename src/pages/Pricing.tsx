
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingPage = () => {
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
    <div className="min-h-screen bg-white dark:bg-[#1A1F2C] transition-colors duration-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Planes Premium
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden ${plan.highlight ? 'border-2 border-primary shadow-xl' : ''}`}>
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">
                    {plan.title}
                  </CardTitle>
                  <CardDescription className="text-center text-3xl font-bold mt-4">
                    {plan.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.benefits.map((benefit, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + idx * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6 hover:scale-105 transition-transform"
                    variant={plan.highlight ? "default" : "outline"}
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
