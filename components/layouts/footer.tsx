import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="relative w-32 h-10 mb-4">
              <Image
                src="/assets/images/iaasf-logo.png"
                alt="IAASF Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm">
              Powering your infrastructure with lightning-fast, secure virtual machines.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <nav className="space-y-2">
              <Link href="/features" className="block text-gray-400 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="block text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="block text-gray-400 hover:text-white transition-colors">
                Documentation
              </Link>
            </nav>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <nav className="space-y-2">
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/careers" className="block text-gray-400 hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <nav className="space-y-2">
              <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} IAASF. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}