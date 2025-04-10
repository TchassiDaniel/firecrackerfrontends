"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { VMmodels } from "@/types/virtualMachine";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    virtualMachines,
    vmModels,
    userVirtualMachines,
    isLoading,
    error,
    fetchVMModels,
    fetchVirtualMachines,
  } = useVirtualMachines();

  const [totalCost, setTotalCost] = useState(0);
  const [totalResources, setTotalResources] = useState({ vcpu: 0, memory: 0 });

  useEffect(() => {
    // Récupérer les modèles de VMs
    fetchVMModels();
  }, [fetchVMModels]);

  console.log(vmModels);
  useEffect(() => {
    // Récupérer les machines virtuelles
    if (user) {
      fetchVirtualMachines(Number.parseInt(user?.user.id, 10));
    }
  }, [fetchVirtualMachines, user]);

  useEffect(() => {
    // Calculate total resources and costs when virtualMachines changes
    if (virtualMachines && virtualMachines.length > 0) {
      const resources = virtualMachines.reduce(
        (acc, vm) => {
          return {
            vcpu: acc.vcpu + (vm.cpu || 0),
            memory: acc.memory + (vm.ram || 0),
          };
        },
        { vcpu: 0, memory: 0 }
      );

      // This is a simple calculation - in reality it would depend on running time
      const cost = virtualMachines.length * 0.5; // Simple placeholder calculation

      setTotalResources(resources);
      setTotalCost(cost);
    }
  }, [virtualMachines]);

  // Format VM model for display
  const formatVMModel = (model: VMmodels, index: number) => {
    const gradients = [
      {
        gradient: "from-blue-50 to-blue-100",
        borderColor: "border-blue-300",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
      },
      {
        gradient: "from-purple-50 to-purple-100",
        borderColor: "border-purple-300",
        buttonColor: "bg-purple-600 hover:bg-purple-700",
      },
      {
        gradient: "from-orange-50 to-orange-100",
        borderColor: "border-orange-300",
        buttonColor: "bg-orange-600 hover:bg-orange-700",
      },
      {
        gradient: "from-green-50 to-green-100",
        borderColor: "border-green-300",
        buttonColor: "bg-green-600 hover:bg-green-700",
      },
    ];

    // Calculate price based on resources (simplified)
    const pricePerHour = (model.cpu * 0.5).toFixed(1);

    // Determine if this is the recommended model (mid-tier)
    const isRecommended = index === 1;

    const style = gradients[index % gradients.length];

    return {
      ...model,
      description: getModelDescription(index),
      specs: [
        { icon: <Cpu className="w-4 h-4" />, text: `${model.cpu} vCPUs` },
        {
          icon: <CircuitBoard className="w-4 h-4" />,
          text: `${model.ram} MiB RAM`,
        },
        {
          icon: <HardDrive className="w-4 h-4" />,
          text: `${model.storage} GB Storage`,
        },
        { icon: <Clock className="w-4 h-4" />, text: `$${pricePerHour}/hour` },
      ],
      price: `$${pricePerHour}`,
      gradient: style.gradient,
      borderColor: style.borderColor,
      buttonColor: style.buttonColor,
      recommended: isRecommended,
    };
  };

  // Helper function to get descriptions based on tier
  const getModelDescription = (index: number) => {
    const descriptions = [
      "Parfait pour les petits projets et le développement",
      "Idéal pour les applications web et les bases de données moyennes",
      "Pour les applications exigeantes et les charges de travail intensives",
      "Solutions haute performance pour les entreprises",
    ];
    return descriptions[index % descriptions.length];
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  // Render loading skeletons for VM models
  const renderModelSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, i) => (
        <motion.div key={`skeleton-${i}`} variants={item}>
          <Card className="p-6 border-2 border-gray-200 rounded-xl overflow-hidden animate-pulse">
            <div className="text-center mb-6">
              <div className="h-6 bg-gray-200 rounded mb-2 w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-2/3 mx-auto"></div>
              <div className="mt-4 mb-6">
                <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              {[1, 2, 3, 4].map((item) => (
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

  // // Render error message
  // const renderError = () => (
  //   <motion.div
  //     initial={{ opacity: 0 }}
  //     animate={{ opacity: 1 }}
  //     className="p-6 bg-red-50 border border-red-200 rounded-xl text-center"
  //   >
  //     <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
  //     <h3 className="text-xl font-bold text-red-800 mb-2">Une erreur s'est produite</h3>
  //     <p className="text-red-600">{error}</p>
  //     <Button
  //       onClick={() => fetchVMModels()}
  //       className="mt-4 bg-red-600 hover:bg-red-700 text-white"
  //     >
  //       Réessayer
  //     </Button>
  //   </motion.div>
  // );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Admin Access Banner */}
        {user?.role === "admin" && (
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
                    <h3 className="font-semibold text-blue-800">
                      Administration Access
                    </h3>
                    <p className="text-blue-600 text-sm">
                      You have administrative privileges
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => router.push("/admin")}
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
                  <h3 className="text-sm font-medium text-gray-500">
                    Total VMs
                  </h3>
                  <p className="text-4xl font-bold mt-2 text-gray-900">
                    {isLoading ? (
                      <span className="block h-10 w-12 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      virtualMachines?.length || 0
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
                  <h3 className="text-sm font-medium text-gray-500">
                    Running VMs
                  </h3>
                  <p className="text-4xl font-bold mt-2 text-green-600">
                    {isLoading ? (
                      <span className="block h-10 w-12 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      virtualMachines?.length || 0
                    )}{" "}
                    {/* All VMs are considered running for now */}
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
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Cost
                  </h3>
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
                  <h3 className="text-sm font-medium text-gray-500">
                    Resources
                  </h3>
                  <div className="mt-2">
                    {isLoading ? (
                      <>
                        <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                        <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-semibold text-gray-700">
                          {totalResources.vcpu} vCPUs
                        </p>
                        <p className="text-lg font-semibold text-gray-700">
                          {totalResources.memory} MiB RAM
                        </p>
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

        {/* VM Models */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="h-1 w-10 bg-blue-600 rounded mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Available VM Models
            </h2>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* {error && renderError()} */}

            {isLoading && renderModelSkeletons()}

            {!isLoading &&
              !error &&
              vmModels &&
              vmModels.map((model, index) => {
                const formattedModel = formatVMModel(model, index);
                return (
                  <motion.div
                    key={model.id}
                    variants={item}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card
                      className={`relative pt-12 px-6 pb-6 border-2 min-h-[500px] flex flex-col justify-between ${formattedModel.borderColor} bg-gradient-to-b ${formattedModel.gradient} rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300`}
                    >
                      {formattedModel.recommended && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white px-6 py-4 rounded-full text-sm font-medium shadow-lg z-20 animate-pulse border border-purple-400/30 backdrop-blur-sm">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_2s_infinite] -skew-x-45"></div>
                          <span className="relative">Recommandé</span>
                        </div>
                      )}
                      <div className="text-center mb-6 relative z-10">
                        <h3 className="text-xl font-bold mb-3 text-gray-800">
                          {formattedModel.distribution_name}
                        </h3>
                        <p className="text-gray-600 text-sm min-h-[60px] px-4">
                          {formattedModel.description}
                        </p>
                        <div className="mt-6 mb-6">
                          <span className="text-3xl font-bold text-gray-800">
                            {formattedModel.price}
                          </span>
                          <span className="text-gray-600">/hour</span>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <ul className="space-y-4 mb-8">
                          {formattedModel.specs.map((spec, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-gray-600"
                            >
                              <div className="mr-3 text-gray-500">
                                {spec.icon}
                              </div>
                              <span className="text-sm">{spec.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        className={`w-full py-4 px-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 ${formattedModel.buttonColor} whitespace-normal`}
                        onClick={() =>
                          router.push(
                            `/virtual-machines/create?model=${model.id}`
                          )
                        }
                      >
                        Créer une VM avec ce modèle
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
              <h2 className="text-2xl font-bold text-gray-900">
                Vos Machines Virtuelles
              </h2>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => router.push("/virtual-machines/create")}
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
          ) : virtualMachines && virtualMachines.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {virtualMachines.map((vm) => (
                <Card
                  key={vm.id}
                  className="p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white"
                >
                  <div className="mb-4 flex justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{vm.name}</h3>
                      <p className="text-sm text-gray-500">ID: {vm.id}</p>
                    </div>
                    <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {vm.state}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Cpu className="h-4 w-4 mr-2" />
                      <span>{vm.cpu} vCPUs</span>
                    </div>
                    <div className="flex items-center">
                      <CircuitBoard className="h-4 w-4 mr-2" />
                      <span>{vm.ram} MiB RAM</span>
                    </div>
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-2" />
                      <span>{vm.storage} Storage</span>
                    </div>
                    <div className="flex items-center">
                      <Server className="h-4 w-4 mr-2" />
                      <span>{vm.ip_address}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push(`/virtual-machines/${vm.id}`)}
                  >
                    Gérer
                  </Button>
                </Card>
              ))}
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
                  <p className="text-2xl font-bold mb-3 text-gray-800">
                    Pas encore de machines virtuelles
                  </p>
                  <p className="text-gray-500 mb-6">
                    Créez votre première machine virtuelle pour commencer votre
                    voyage dans le cloud.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => router.push("/virtual-machines/create")}
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
