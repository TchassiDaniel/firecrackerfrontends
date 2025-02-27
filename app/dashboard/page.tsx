'use client';

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Cpu, CircuitBoard, HardDrive, Clock, Check, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const vmOffers = [
    {
      name: 'Basic',
      description: 'Parfait pour les petits projets et le développement',
      specs: [
        { icon: <Cpu className="w-4 h-4" />, text: '1 vCPUs' },
        { icon: <CircuitBoard className="w-4 h-4" />, text: '1024 MiB RAM' },
        { icon: <HardDrive className="w-4 h-4" />, text: '10 GB Storage' },
        { icon: <Clock className="w-4 h-4" />, text: '$0.5/hour' },
      ],
      price: '$0.5',
      color: 'border-blue-200 hover:border-blue-400',
      recommended: false
    },
    {
      name: 'Standard',
      description: 'Idéal pour les applications web et les bases de données moyennes',
      specs: [
        { icon: <Cpu className="w-4 h-4" />, text: '2 vCPUs' },
        { icon: <CircuitBoard className="w-4 h-4" />, text: '2048 MiB RAM' },
        { icon: <HardDrive className="w-4 h-4" />, text: '20 GB Storage' },
        { icon: <Clock className="w-4 h-4" />, text: '$1.0/hour' },
      ],
      price: '$1.0',
      color: 'border-purple-200 hover:border-purple-400',
      recommended: true
    },
    {
      name: 'Premium',
      description: 'Pour les applications exigeantes et les charges de travail intensives',
      specs: [
        { icon: <Cpu className="w-4 h-4" />, text: '4 vCPUs' },
        { icon: <CircuitBoard className="w-4 h-4" />, text: '4096 MiB RAM' },
        { icon: <HardDrive className="w-4 h-4" />, text: '40 GB Storage' },
        { icon: <Clock className="w-4 h-4" />, text: '$2.0/hour' },
      ],
      price: '$2.0',
      color: 'border-orange-200 hover:border-orange-400',
      recommended: false
    },
    {
      name: 'Enterprise',
      description: 'Solutions haute performance pour les entreprises',
      specs: [
        { icon: <Cpu className="w-4 h-4" />, text: '8 vCPUs' },
        { icon: <CircuitBoard className="w-4 h-4" />, text: '8192 MiB RAM' },
        { icon: <HardDrive className="w-4 h-4" />, text: '80 GB Storage' },
        { icon: <Clock className="w-4 h-4" />, text: '$4.0/hour' },
      ],
      price: '$4.0',
      color: 'border-green-200 hover:border-green-400',
      recommended: false
    },
  ];

  return (
    <div className="p-6 bg-gray-50">
      {/* Admin Access Banner */}
      {user?.role === 'admin' && (
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <p className="text-blue-700">Administration Access - You have administrative privileges</p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push('/admin')}
            >
              Access Admin Panel
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-sm font-medium text-gray-500">Total VMs</h3>
          <p className="text-4xl font-bold mt-2 text-gray-900">0</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-sm font-medium text-gray-500">Running VMs</h3>
          <p className="text-4xl font-bold mt-2 text-green-600">0</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
          <p className="text-4xl font-bold mt-2 text-blue-600">$0.00</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-sm font-medium text-gray-500">Resources</h3>
          <div className="mt-2">
            <p className="text-lg font-semibold text-gray-700">0 vCPUs</p>
            <p className="text-lg font-semibold text-gray-700">0 MiB RAM</p>
          </div>
        </Card>
      </div>

      {/* VM Offers */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Available VM Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {vmOffers.map((offer) => (
            <Card 
              key={offer.name} 
              className={`relative p-6 border-2 transition-all duration-300 hover:shadow-xl ${offer.color}`}
            >
              {offer.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Recommended
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{offer.name}</h3>
                <p className="text-gray-600 text-sm">{offer.description}</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold">{offer.price}</span>
                  <span className="text-gray-600">/hour</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {offer.specs.map((spec, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <div className="mr-3 text-gray-400">{spec.icon}</div>
                    <span>{spec.text}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full py-6 text-base font-semibold transition-transform duration-200 transform hover:scale-105
                  ${offer.recommended ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
              >
                Create VM with this offer
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Virtual Machines List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Your Virtual Machines</h2>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-5 w-5 mr-2" />
            New VM
          </Button>
        </div>
        <Card className="p-12 text-center text-gray-500 hover:shadow-lg transition-shadow duration-300">
          <div className="max-w-sm mx-auto">
            <div className="mb-4">
              <HardDrive className="h-12 w-12 mx-auto text-gray-400" />
            </div>
            <p className="text-xl font-semibold mb-2">No Virtual Machines Yet</p>
            <p className="text-gray-500">Create your first virtual machine to get started.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
