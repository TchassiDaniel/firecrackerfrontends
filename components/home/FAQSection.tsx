'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Comment fonctionne le système de facturation ?",
      answer: "Notre système de facturation est basé sur une tarification à l'usage. Vous ne payez que pour les ressources que vous consommez, au prorata temporis. Les tarifs sont calculés par heure d'utilisation et vous pouvez consulter votre consommation en temps réel depuis votre tableau de bord. Pour plus d'économies, nous proposons également des forfaits mensuels avec une remise de 20%."
    },
    {
      question: "Quels systèmes d'exploitation sont supportés ?",
      answer: "Notre plateforme supporte une large gamme de systèmes d'exploitation, incluant Ubuntu, Debian, CentOS, Fedora, Windows Server, et bien d'autres. Vous pouvez également importer vos propres images personnalisées pour une flexibilité maximale. Consultez notre documentation pour la liste complète des systèmes supportés."
    },
    {
      question: "Comment puis-je migrer mes applications existantes ?",
      answer: "La migration de vos applications est simple grâce à nos outils dédiés. Vous pouvez utiliser notre service de migration assistée, importer directement vos machines virtuelles existantes ou utiliser nos guides étape par étape pour une migration manuelle. Notre équipe support est également disponible pour vous accompagner tout au long du processus."
    },
    {
      question: "Quelle est la disponibilité garantie de la plateforme ?",
      answer: "Nous garantissons une disponibilité de 99,99% pour nos plans Entreprise (SLA), ce qui correspond à moins de 1 heure d'indisponibilité par an. Pour les autres plans, nous maintenons un taux de disponibilité de 99,9%, soit environ 8 heures d'indisponibilité maximum par an. Des crédits de service sont automatiquement accordés en cas de non-respect de ces engagements."
    },
    {
      question: "Quelles mesures de sécurité sont en place ?",
      answer: "La sécurité est notre priorité absolue. Notre infrastructure est protégée par plusieurs couches de sécurité incluant firewalls avancés, protection DDoS, chiffrement des données au repos et en transit, isolation complète des machines virtuelles, authentification multi-facteurs, et audits de sécurité réguliers. Nous sommes conformes aux normes ISO 27001, SOC 2 Type II et GDPR."
    },
    {
      question: "Comment fonctionne le support technique ?",
      answer: "Notre support technique est disponible 24/7 pour tous les clients. Les plans Standard et supérieurs bénéficient d'un support prioritaire avec des temps de réponse garantis. Vous pouvez nous contacter par ticket, chat en direct ou téléphone. Notre base de connaissances détaillée et notre communauté active sont également d'excellentes ressources pour résoudre rapidement les problèmes courants."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-6 py-2 rounded-full shadow-sm animate-pulse">
            Questions fréquentes
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-8 mb-6 text-gray-800 leading-tight">
            Tout ce que vous devez savoir
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Vous avez des questions sur notre plateforme ? Consultez notre FAQ pour obtenir des réponses rapides à vos interrogations les plus courantes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative mb-16">
            <div className="absolute top-0 right-0 -mt-16 mr-16 lg:-mr-24 lg:-mt-12 opacity-30 rotate-12">
              <Image 
                src="/assets/images/question-marks.svg" 
                alt="Question marks" 
                width={150}
                height={150}
              />
            </div>
            
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-blue-100">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className={`border-b border-gray-100 last:border-none transition-colors duration-300 ${openIndex === index ? 'bg-gradient-to-r from-blue-50 to-white' : 'hover:bg-gray-50'}`}
                >
                  <button
                    className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                    onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                  >
                    <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
                    <span className={`ml-6 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-6 pt-0 text-gray-600 text-lg leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          
          
          <div className="mt-16 px-8 py-6 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-blue-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-gray-700 font-medium">Consultez notre documentation complète pour des informations détaillées</span>
            </div>
            <button className="flex-shrink-0 bg-white px-5 py-2 rounded-lg shadow-sm text-blue-600 font-medium hover:bg-gray-50 transition-colors">
              Accéder
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}