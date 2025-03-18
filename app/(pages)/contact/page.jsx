'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0066FF] text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Have questions or need support? We're here to help. Reach out to our team today.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-gray-700 mb-2">Company (Optional)</label>
                <Input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us how we can help you"
                  rows={5}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#0066FF] hover:bg-blue-700 text-white"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">Sales Inquiries</h4>
                <p className="text-gray-600">sales@iaasf.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Support</h4>
                <p className="text-gray-600">support@iaasf.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Address</h4>
                <p className="text-gray-600">
                  123 Cloud Avenue
                  San Francisco, CA 94105
                  United States
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Phone</h4>
                <p className="text-gray-600">+1 (415) 555-0123</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}