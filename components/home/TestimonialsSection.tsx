import Image from 'next/image';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Depuis que nous avons migré vers cette plateforme, le temps de déploiement de nos serveurs est passé de plusieurs minutes à quelques secondes. C'est un gain de productivité incroyable pour notre équipe.",
      author: "Marie Durand",
      role: "CTO, TechStart SAS",
      avatar: "/images/avatar2.jpeg",
      rating: 5
    },
    {
      quote: "La flexibilité de la plateforme nous permet d'adapter rapidement nos ressources selon nos besoins. Les performances sont excellentes et le support technique est toujours réactif.",
      author: "Thomas Leroux",
      role: "Lead DevOps, MediaCloud",
      avatar: "/images/avatar.jpg",
      rating: 5
    },
    {
      quote: "L'intégration avec nos outils CI/CD a été transparente. Nous pouvons maintenant automatiser l'ensemble de notre chaîne de déploiement sans compromis sur la sécurité.",
      author: "Sophie Martin",
      role: "DevOps Engineer, FinTech Solutions",
      avatar: "/images/avatar1.jpg",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 relative">
        {/* Éléments décoratifs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-100 rounded-full opacity-20 blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-3xl mx-auto text-center mb-20 relative">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold px-6 py-2 rounded-full shadow-sm mb-4">Témoignages</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez comment notre plateforme transforme l'infrastructure de nos clients 
            et accélère leur développement au quotidien.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden group"
            >
              {/* Accent décoratif */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
              
              {/* Quotation mark */}
              <div className="absolute -right-4 -top-4 text-blue-100 opacity-40 group-hover:opacity-70 transition-opacity">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
              </div>
              
              <div className="flex gap-3 items-center mb-6">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-100">
                  <Image 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{testimonial.author}</h4>
                  <p className="text-blue-600 text-sm font-medium">{testimonial.role}</p>
                </div>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-6 text-lg italic">{testimonial.quote}</p>
              
              <div className="flex items-center">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-blue-50 max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-50"></div>
          
          <div className="grid md:grid-cols-5 gap-6 items-center relative">
            <div className="md:col-span-3">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Rejoignez les entreprises qui transforment leur infrastructure
              </h3>
              <p className="text-gray-600 mb-6">
                Notre plateforme s'adapte à tous les besoins, des startups aux grandes entreprises.
                Profitez d'un essai gratuit de 30 jours sans engagement.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow">
                  Essai gratuit
                </button>
                <button className="bg-white text-blue-600 border border-blue-200 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Voir les cas clients
                </button>
              </div>
            </div>
            
            <div className="md:col-span-2 flex justify-center">
              <div className="relative h-48 w-48">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
                <Image 
                  src="/assets/images/client-logos.png" 
                  alt="Logos de clients" 
                  fill 
                  className="object-contain relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            {[0, 1, 2].map((dot, i) => (
              <button 
                key={i} 
                className={`w-3 h-3 rounded-full transition-colors ${i === 0 ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Voir page ${i + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}