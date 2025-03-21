'use client';

import { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useVirtualMachines } from "@/hooks/useVirtualMachines";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Cpu, 
  CircuitBoard, 
  HardDrive, 
  Clock, 
  ShieldCheck,
  Activity,
  Server,
  DollarSign,
  AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { VMOffer } from '@/types/virtualMachine';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { 
    vmOffers,
    userVirtualMachines,
    isLoading,
    error,
    fetchVMOffers,
    fetchUserVirtualMachines 
  } = useVirtualMachines();
  
  const [totalCost, setTotalCost] = useState(0);
  const [totalResources, setTotalResources] = useState({ vcpu: 0, memory: 0 });

  useEffect(() => {
    // Fetch VM offers and user VMs when component mounts
    fetchVMOffers();
    if (user?.id) {
      fetchUserVirtualMachines(user.id);
    }
  }, [fetchVMOffers, fetchUserVirtualMachines, user]);

  useEffect(() => {
    // Calculate total resources and costs when userVirtualMachines changes
    if (userVirtualMachines) {
      const resources = userVirtualMachines.reduce((acc, vm) => {
        return {
          vcpu: acc.vcpu + vm.vcpu_count,
          memory: acc.memory + vm.memory_size_mib
        };
      }, { vcpu: 0, memory: 0 });
      
      // This is a simple calculation - in reality it would depend on running time
      const cost = userVirtualMachines.reduce((acc, vm) => {
        // Assuming a placeholder cost calculation
        return acc + (vm.status === 'running' ? 1 : 0);
      }, 0);
      
      setTotalResources(resources);
      setTotalCost(cost);
    }
  }, [userVirtualMachines]);

  // Format VM offer for display
  const formatVMOffer = (offer: VMOffer, index: number) => {
    const gradients = [
      { gradient: 'from-blue-50 to-blue-100', borderColor: 'border-blue-300', buttonColor: 'bg-blue-600 hover:bg-blue-700' },
      { gradient: 'from-purple-50 to-purple-100', borderColor: 'border-purple-300', buttonColor: 'bg-purple-600 hover:bg-purple-700' },
      { gradient: 'from-orange-50 to-orange-100', borderColor: 'border-orange-300', buttonColor: 'bg-orange-600 hover:bg-orange-700' },
      { gradient: 'from-green-50 to-green-100', borderColor: 'border-green-300', buttonColor: 'bg-green-600 hover:bg-green-700' },
    ];
    
    // Calculate price based on resources (simplified)
    const pricePerHour = (offer.cpu_count * 0.5).toFixed(1);
    
    // Determine if this is the recommended offer (mid-tier)
    const isRecommended = index === 1;
    
    const style = gradients[index % gradients.length];
    
    return {
      ...offer,
      description: getOfferDescription(index),
      specs: [
        { icon: <Cpu className="w-4 h-4" />, text: `${offer.cpu_count} vCPUs` },
        { icon: <CircuitBoard className="w-4 h-4" />, text: `${offer.memory_size} MiB RAM` },
        { icon: <HardDrive className="w-4 h-4" />, text: `${offer.disk_size} GB Storage` },
        { icon: <Clock className="w-4 h-4" />, text: `$${pricePerHour}/hour` },
      ],
      price: `$${pricePerHour}`,
      gradient: style.gradient,
      borderColor: style.borderColor,
      buttonColor: style.buttonColor,
      recommended: isRecommended
    };
  };

  // Helper function to get descriptions based on tier
  const getOfferDescription = (index: number) => {
    const descriptions = [
      'Parfait pour les petits projets et le développement',
      'Idéal pour les applications web et les bases de données moyennes',
      'Pour les applications exigeantes et les charges de travail intensives',
      'Solutions haute performance pour les entreprises'
    ];
    return descriptions[index % descriptions.length];
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Render loading skeletons for VM offers
  const renderOfferSkeletons = () => {
    return Array(4).fill(0).map((_, i) => (
      <motion.div 
        key={`skeleton-${i}`}
        variants={item}
      >
        <Card className="p-6 border-2 border-gray-200 rounded-xl overflow-hidden animate-pulse">
          <div className="text-center mb-6">
            <div className="h-6 bg-gray-200 rounded mb-2 w-1/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded mb-6 w-2/3 mx-auto"></div>
            <div className="mt-4 mb-6">
              <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded-full mr-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </Card>
      </motion.div>
    ));
  };

  // Render error message
  const renderError = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-red-50 border border-red-200 rounded-xl text-center"
    >
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-red-800 mb-2">Une erreur s'est produite</h3>
      <p className="text-red-600">{error}</p>
      <Button 
        onClick={() => fetchVMOffers()}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white"
      >
        Réessayer
      </Button>
    </motion.div>
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Admin Access Banner */}
        {user?.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 overflow-hidden relative">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              <div className="p-6 flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Administration Access</h3>
                    <p className="text-blue-600 text-sm">You have administrative privileges</p>
                  </div>
                </div>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => router.push('/admin')}
                >
                  Access Admin Panel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <motion.div variants={item}>
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-gray-400 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total VMs</h3>
                  <p className="text-4xl font-bold mt-2 text-gray-900">
                    {isLoading ? (
                      <span className="block h-10 w-12 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      userVirtualMachines?.length || 0
                    )}
                  </p>
                </div>
                <div className="p-2 bg-gray-100 rounded-full">
                  <Server className="h-6 w-6 text-gray-500" />
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-green-400 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Running VMs</h3>
                  <p className="text-4xl font-bold mt-2 text-green-600">
                    {isLoading ? (
                      <span className="block h-10 w-12 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      userVirtualMachines?.filter(vm => vm.status === 'running').length || 0
                    )}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-blue-400 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
                  <p className="text-4xl font-bold mt-2 text-blue-600">
                    {isLoading ? (
                      <span className="block h-10 w-16 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      `$${totalCost.toFixed(2)}`
                    )}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-purple-400 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Resources</h3>
                  <div className="mt-2">
                    {isLoading ? (
                      <>
                        <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                        <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-semibold text-gray-700">{totalResources.vcpu} vCPUs</p>
                        <p className="text-lg font-semibold text-gray-700">{totalResources.memory} MiB RAM</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Cpu className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* VM Offers */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="h-1 w-10 bg-blue-600 rounded mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">Available VM Offers</h2>
          </div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {error && renderError()}
            
            {isLoading && renderOfferSkeletons()}
            
            {!isLoading && !error && vmOffers && vmOffers.map((offer, index) => {
              const formattedOffer = formatVMOffer(offer, index);
              return (
                <motion.div 
                  key={offer.id}
                  variants={item}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card 
                    className={`relative p-6 border-2 ${formattedOffer.borderColor} bg-gradient-to-b ${formattedOffer.gradient} rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300`}
                  >
                    {formattedOffer.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                        Recommandé
                      </div>
                    )}
                    <div className="text-center mb-6 relative z-10">
                      <h3 className="text-xl font-bold mb-2">{formattedOffer.name}</h3>
                      <p className="text-gray-600 text-sm">{formattedOffer.description}</p>
                      <div className="mt-4 mb-6">
                        <span className="text-3xl font-bold">{formattedOffer.price}</span>
                        <span className="text-gray-600">/hour</span>
                      </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {formattedOffer.specs.map((spec, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <div className="mr-3 text-gray-500">{spec.icon}</div>
                          <span>{spec.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full py-6 text-base font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 ${formattedOffer.buttonColor}`}
                      onClick={() => router.push(`/virtual-machines/new?offer=${offer.id}`)}
                    >
                      Créer une VM avec cette offre
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Virtual Machines List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="h-1 w-10 bg-blue-600 rounded mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-900">Vos Machines Virtuelles</h2>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => router.push('/virtual-machines/new')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle VM
            </Button>
          </div>
          
          {isLoading ? (
            <Card className="p-16 text-center animate-pulse">
              <div className="max-w-sm mx-auto">
                <div className="mb-6 bg-gray-100 p-6 rounded-full inline-block">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </Card>
          ) : userVirtualMachines && userVirtualMachines.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* VM cards would go here - simplified for this example */}
              <Card className="p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white">
                <div className="mb-4 flex justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Exemple VM</h3>
                    <p className="text-sm text-gray-500">Créée le {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Running
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 mr-2" />
                    <span>2 vCPUs</span>
                  </div>
                  <div className="flex items-center">
                    <CircuitBoard className="h-4 w-4 mr-2" />
                    <span>2048 MiB RAM</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push(`/virtual-machines/1`)}
                >
                  Gérer
                </Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-16 text-center text-gray-500 bg-white border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300">
                <div className="max-w-sm mx-auto">
                  <div className="mb-6 bg-gray-100 p-6 rounded-full inline-block">
                    <HardDrive className="h-12 w-12 mx-auto text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold mb-3 text-gray-800">Pas encore de machines virtuelles</p>
                  <p className="text-gray-500 mb-6">Créez votre première machine virtuelle pour commencer votre voyage dans le cloud.</p>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => router.push('/virtual-machines/new')}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Créer votre première VM
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}