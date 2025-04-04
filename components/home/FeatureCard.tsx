import Image from 'next/image';
import Link from 'next/link';

export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Ultra rapide",
      description: "Lancez vos machines virtuelles en quelques millisecondes grâce à la technologie MicroVM de Firecracker."
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Sécurité maximale",
      description: "Bénéficiez d'une isolation renforcée grâce à notre technologie de virtualisation de pointe."
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Contrôle complet",
      description: "Gérez vos machines virtuelles avec notre tableau de bord intuitif et notre API RESTful."
    }
  ];

  const additionalFeatures = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Haute performance",
      description: "Profitez de performances optimales avec des ressources dédiées et un surcoût minimal."
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Disponibilité maximale",
      description: "Bénéficiez d'une disponibilité de 99,99% avec notre infrastructure redondante."
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: "Entièrement personnalisable",
      description: "Configurez vos machines selon vos besoins avec une variété d'options et de templates."
    }
  ];

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          {/* En-tête de section */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-medium tracking-wide mb-3">
              FONCTIONNALITÉS PRINCIPALES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir notre plateforme ?
            </h2>
            <p className="text-lg text-gray-600">
              Notre solution de machines virtuelles combine performance, sécurité et simplicité
            </p>
          </div>
          
          {/* Grille de fonctionnalités principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 flex flex-col"
              >
                <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center mb-5 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{feature.description}</p>
                <div className="mt-auto">
                  <Link 
                    href="#" 
                    className="text-blue-600 font-medium inline-flex items-center group"
                  >
                    En savoir plus
                    <svg 
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section avec image */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
                <Image 
                  src="/images/architecture.webp" 
                  alt="Dashboard de gestion des machines virtuelles" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20"></div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <span className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-medium tracking-wide mb-3">
                TECHNOLOGIE AVANCÉE
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Performances inégalées pour vos applications
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Notre plateforme utilise la technologie Firecracker pour fournir des MicroVMs ultra-légères qui démarrent en millisecondes et offrent des performances natives.
              </p>
              <ul className="space-y-3 mb-8">
                {["Démarrage en moins de 125ms", "Isolation de sécurité renforcée", "Faible empreinte mémoire", "Performances proches du bare metal"].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
                Explorer la technologie
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités supplémentaires */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium tracking-wide mb-3">
              ENCORE PLUS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Des fonctionnalités conçues pour vous
            </h2>
            <p className="text-lg text-gray-600">
              Notre plateforme répond aux besoins des développeurs et des entreprises exigeantes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="border-b border-gray-100 py-3 px-6 flex items-center">
                  <div className="text-blue-600 mr-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to action */}
          <div className="mt-16 text-center">
            <Link 
              href="/auth/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow transition-colors duration-200 inline-flex items-center"
            >
              Commencer maintenant
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}