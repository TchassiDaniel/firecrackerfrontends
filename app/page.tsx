import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0066FF] text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Deploy Virtual Machines in Seconds
              </h1>
              <p className="text-lg leading-relaxed opacity-90">
                Experience lightning-fast VM deployment with our Firecracker-powered platform. Get started in minutes with secure, isolated, and high-performance virtual machines.
              </p>
              <div className="flex gap-4 pt-4">
                <Button
                  asChild
                  className="bg-white hover:bg-gray-50 text-[#0066FF] font-medium px-8 h-11"
                >
                  <Link href="/auth/register">Get Started</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="border-2 border-white text-white hover:bg-white/10 font-medium px-8 h-11"
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Logo */}
            <div className="hidden lg:flex justify-center items-center bg-white rounded-lg p-12">
              <div className="relative w-full max-w-[400px] aspect-[3/2]">
                <Image
                  src="/assets/images/iaasf-logo.png"
                  alt="IAASF Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-500">
              Discover the benefits of our modern VM management solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#0066FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-500">
                Launch new VMs in milliseconds with Firecracker's innovative MicroVM technology.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#0066FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Secure by Design</h3>
              <p className="text-gray-500">
                Benefit from strong isolation and security with our virtualization technology.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#0066FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Easy Management</h3>
              <p className="text-gray-500">
                Control your VMs with our intuitive dashboard and powerful API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-500">
              Choose the plan that best fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-xl p-8">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Basic</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">$0.5</span>
                  <span className="text-gray-500 ml-1">/hour</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  1 vCPUs
                </li>
                <li className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  1024 MiB RAM
                </li>
                <li className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  10 GB Storage
                </li>
              </ul>
              <Button asChild className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-medium">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>

            {/* Standard Plan */}
            <div className="bg-white rounded-xl p-8">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Standard</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">$1.0</span>
                  <span className="text-gray-500 ml-1">/hour</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  2 vCPUs
                </li>
                <li className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  2048 MiB RAM
                </li>
                <li className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  20 GB Storage
                </li>
              </ul>
              <Button asChild className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-medium">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-xl p-8">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Premium</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">$2.0</span>
                  <span className="text-gray-500 ml-1">/hour</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  4 vCPUs
                </li>
                <li className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  4096 MiB RAM
                </li>
                <li className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  40 GB Storage
                </li>
              </ul>
              <Button asChild className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-medium">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl p-8">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Enterprise</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">$4.0</span>
                  <span className="text-gray-500 ml-1">/hour</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  8 vCPUs
                </li>
                <li className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  8192 MiB RAM
                </li>
                <li className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-3 text-[#0066FF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  80 GB Storage
                </li>
              </ul>
              <Button asChild className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-medium">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
