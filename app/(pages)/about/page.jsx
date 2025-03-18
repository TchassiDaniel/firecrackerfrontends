import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0066FF] text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">About IAASF</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            We're revolutionizing cloud infrastructure with lightning-fast, secure, and scalable virtual machines powered by cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At IAASF, we're committed to democratizing cloud computing by providing developers and businesses with ultra-fast, secure, and easy-to-use virtual machine infrastructure.
            </p>
            <p className="text-gray-600">
              Our platform leverages Firecracker technology to deliver unprecedented performance, security, and simplicity in cloud computing.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-[400px] aspect-square relative">
              <Image 
                src="/assets/images/mission-illustration.svg" 
                alt="Our Mission" 
                fill 
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", title: "CEO & Co-Founder", image: "/assets/images/team/sarah.jpg" },
              { name: "Michael Rodriguez", title: "CTO & Co-Founder", image: "/assets/images/team/michael.jpg" },
              { name: "Emily Wong", title: "Chief Product Officer", image: "/assets/images/team/emily.jpg" }
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-32 h-32 mx-auto mb-4 relative rounded-full overflow-hidden">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-500">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#0066FF] text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers and businesses using IAASF for lightning-fast VM deployment.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              asChild
              className="bg-white hover:bg-gray-50 text-[#0066FF] font-medium px-8 h-12"
            >
              <Link href="/auth/register">Create Account</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 font-medium px-8 h-12"
            >
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}