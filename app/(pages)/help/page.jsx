'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('getting-started');

  const faqData = {
    'getting-started': [
      {
        question: "How do I create my first virtual machine?",
        answer: "Creating a VM is simple. Log into your dashboard, click 'Create VM', select your desired configuration, and deploy. Our wizard will guide you through each step."
      },
      {
        question: "What operating systems are supported?",
        answer: "We support multiple Linux distributions including Ubuntu, CentOS, Debian, and Alpine. Windows Server images are also available."
      }
    ],
    'billing': [
      {
        question: "How are VMs billed?",
        answer: "VMs are billed on a per-hour basis. You only pay for the compute resources you use, with no minimum commitment."
      },
      {
        question: "Can I change my plan?",
        answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated."
      }
    ],
    'technical': [
      {
        question: "What makes IAASF's VMs different?",
        answer: "We use Firecracker technology, enabling ultra-fast VM startup times, strong isolation, and minimal performance overhead."
      },
      {
        question: "How secure are your virtual machines?",
        answer: "Security is our top priority. Each VM runs in its own isolated environment with hardware-level security boundaries."
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0066FF] text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Find answers to your questions and get the support you need to succeed.
          </p>
        </div>
      </section>

      {/* Help Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="space-y-2">
              {[
                { id: 'getting-started', label: 'Getting Started' },
                { id: 'billing', label: 'Billing' },
                { id: 'technical', label: 'Technical Support' }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* FAQ Content */}
            <div className="md:col-span-3">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                {activeTab === 'getting-started' && 'Getting Started'}
                {activeTab === 'billing' && 'Billing Questions'}
                {activeTab === 'technical' && 'Technical Support'}
              </h2>
              
              <Accordion type="single" collapsible>
                {faqData[activeTab].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Need More Help?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Live Chat",
                description: "Connect with our support team in real-time",
                action: "Start Chat"
              },
              {
                title: "Email Support",
                description: "Detailed help via email within 24 hours",
                action: "Send Email"
              },
              {
                title: "Community Forum",
                description: "Get help from other IAASF users",
                action: "Visit Forum"
              }
            ].map((option) => (
              <div key={option.title} className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <Button variant="outline" className="w-full">
                  {option.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}