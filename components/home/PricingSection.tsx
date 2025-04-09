"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
export default function PricingSection() {

  const { isAuthenticated } = useAuth();

  const plans = [
    {
      name: "Basic",
      tagline: "Pour commencer",
      price: "0,5 €",
      unit: "/heure",
      features: [
        "1 vCPU",
        "1024 Mio de RAM",
        "10 Go de stockage SSD",
        "Bande passante 1 Gbps",
        "Console web"
      ],
      color: "from-blue-400 to-blue-300",
      textColor: "text-blue-600",
      buttonText: "Sélectionner",
      buttonColor: "bg-blue-500 hover:bg-blue-600"
    },
    {
      name: "Standard",
      tagline: "Le plus populaire",
      price: "1,0 €",
      unit: "/heure",
      features: [
        "2 vCPU",
        "2048 Mio de RAM",
        "20 Go de stockage SSD",
        "Bande passante 1 Gbps",
        "Console web",
        "Sauvegardes quotidiennes"
      ],
      color: "from-indigo-500 to-purple-500",
      textColor: "text-indigo-600",
      popular: true,
      buttonText: "Sélectionner",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
      name: "Premium",
      tagline: "Pour les pros",
      price: "2,0 €",
      unit: "/heure",
      features: [
        "4 vCPU",
        "4096 Mio de RAM",
        "40 Go de stockage SSD",
        "Bande passante 2 Gbps",
        "Console web",
        "Sauvegardes quotidiennes",
        "SLA 99.9%"
      ],
      color: "from-purple-500 to-pink-500",
      textColor: "text-purple-600",
      buttonText: "Sélectionner",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
      name: "Entreprise",
      tagline: "Solutions sur mesure",
      price: "4,0 €",
      unit: "/heure",
      features: [
        "8 vCPU",
        "8192 Mio de RAM",
        "80 Go de stockage SSD",
        "Bande passante 5 Gbps",
        "Console web",
        "Sauvegardes quotidiennes",
        "SLA 99.99%",
        "Support prioritaire"
      ],
      color: "from-pink-500 to-rose-500",
      textColor: "text-rose-600",
      buttonText: "Sélectionner",
      buttonColor: "bg-rose-600 hover:bg-rose-700"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block animate-bounce mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">Tarifs</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-6 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Choisissez le plan parfait pour vous
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            Une tarification simple et transparente. Payez uniquement pour ce que vous utilisez,
            <span className="font-medium"> sans engagement ni frais cachés.</span>
          </p>
          
          <div className="flex items-center justify-center mt-10 bg-white rounded-full p-2 shadow-md max-w-xs mx-auto">
            <span className={`text-gray-900 font-medium py-2 px-4 rounded-full bg-gradient-to-r from-blue-100 to-blue-200`}>Paiement horaire</span>
            <span className="text-gray-500 font-medium py-2 px-4">Mensuel (-20%)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-3xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'lg:scale-105 shadow-xl' : 'shadow-lg'
              }`}
            >
              <div className={`h-2 bg-gradient-to-r ${plan.color}`}></div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-2xl font-bold ${plan.textColor}`}>{plan.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{plan.tagline}</p>
                  </div>
                  {plan.popular && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">Populaire</span>
                  )}
                </div>
                
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-2 text-lg">{plan.unit}</span>
                </div>
                
                <ul className="space-y-5 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className={`flex-shrink-0 w-6 h-6 ${plan.textColor} rounded-full flex items-center justify-center mr-3`}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild 
                  className={`w-full py-3 px-4 rounded-xl font-medium text-white ${plan.buttonColor}`}
                  >
                  <Link href={isAuthenticated ? "/dashboard" : "/auth/register"}>
                    {isAuthenticated ? "Selectionner" : plan.buttonText}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 rounded-3xl p-0 overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Une solution sur mesure pour votre entreprise ?</h3>
              <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
                Contactez notre équipe pour discuter de vos besoins spécifiques et obtenir un devis personnalisé.
                Nous sommes là pour vous accompagner dans votre transformation numérique.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-8 py-4 rounded-xl text-lg">
                  <Link href="/contact">Contacter notre équipe</Link>
                </Button>
                <Button asChild className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium px-8 py-4 rounded-xl text-lg">
                  <Link href="/demo">Réserver une démo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500 max-w-2xl mx-auto">
            Tous nos prix sont affichés hors taxes. Vous avez des questions sur nos tarifs ?
            <Link href="/faq" className="text-blue-600 font-medium ml-1 hover:underline">Consultez notre FAQ</Link>
          </p>
        </div>
      </div>
    </section>
  );
}