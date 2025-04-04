import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 border-b-2 border-blue-500 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4 text-blue-900">About IAASF</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-950">
            We're revolutionizing cloud infrastructure with lightning-fast, secure, and scalable virtual machines powered by cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white border-b-2 border-blue-500 text">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-950">Our Mission</h2>
            <p className="text-blue-950 mb-4">
              At IAASF, we're committed to democratizing cloud computing by providing developers and businesses with ultra-fast, secure, and easy-to-use virtual machine infrastructure.
            </p>
            <p className="text-blue-800">
              Our platform leverages Firecracker technology to deliver unprecedented performance, security, and simplicity in cloud computing.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-full aspect-square relative  border-gray-200 rounded-lg ">
              <Image 
                src="/images/architecture.webp" 
                alt="Our Mission" 
                fill 
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white border-b-2 border-blue-500">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-blue-950">Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8 bg-blue-50 p-8 rounded-lg">
            {[
              { name: "Sarah Chen", title: "CEO & Co-Founder", image: "/images/avatar.jpg" },
              { name: "Michael Rodriguez", title: "CTO & Co-Founder", image: "/images/avatar1.jpg" },
              { name: "Emily Wong", title: "Chief Product Officer", image: "/images/avatar2.jpeg" }
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-xl p-6 border-2 border-blue-600">
                <div className="w-32 h-32 mx-auto mb-4 relative rounded-full overflow-hidden border-2 border-gray-300">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-500">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white border-t-2 border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-blue-950">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-900">
            Join thousands of developers and businesses using IAASF for lightning-fast VM deployment.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              asChild
              className="bg-blue-700 hover:bg-sky-800 text-white font-medium px-8 h-12 border-2 border-gray-800"
            >
              <Link href="/auth/register">Create Account</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-gray-400 text-blue-800 hover:bg-gray-200 font-medium px-8 h-12"
            >
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}