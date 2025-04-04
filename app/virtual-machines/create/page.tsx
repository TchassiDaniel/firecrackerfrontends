"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  ArrowLeft, 
  Check, 
  Server, 
  Globe, 
  Lock, 
  Terminal,
  Cpu,
  MemoryStick,
  HardDrive,
  Cloud,
  Power
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useVirtualMachines } from "@/hooks/useVirtualMachines";
import { SystemImage, VMmodels } from "@/types/virtualMachine";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  model_id: z.number().min(1, "Veuillez sélectionner un modèle de VM"),
  location: z.string().min(1, "Veuillez sélectionner une localisation"),
  owner_id: z.number().optional()
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const StatsCard = ({ icon: Icon, title, value, color }: any) => (
  <motion.div
    variants={fadeInUp}
    className={`bg-white rounded-xl p-4 shadow-lg border-l-4 ${color}`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color.replace('border', 'bg')}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default function CreateVirtualMachinePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    systemImages,
    vmModels,
    locations,
    isLoading,
    error,
    fetchSystemImages,
    fetchVMModels,
    fetchLocations,
    createVirtualMachine
  } = useVirtualMachines();

  const [selectedModel, setSelectedModel] = useState<VMmodels | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
      model_id: 1,
      location: "",
      owner_id: Number(user?.id) || 1
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchSystemImages(),
          fetchVMModels(),
          fetchLocations()
        ]);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger les données nécessaires",
        });
      }
    };

    loadData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await createVirtualMachine(values);
      
      toast({
        title: "Nouvelle machine virtuelle créée",
        description: (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeInUp}
            className="space-y-4 mt-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Power className="w-5 h-5 text-green-500" />
              <span className="font-medium">Configuration terminée avec succès</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatsCard
                icon={Cpu}
                title="CPU"
                value={`${result.cpu} cœurs`}
                color="border-blue-500"
              />
              <StatsCard
                icon={MemoryStick}
                title="RAM"
                value={`${result.ram} MB`}
                color="border-purple-500"
              />
              <StatsCard
                icon={HardDrive}
                title="Stockage"
                value={`${result.storage} GB`}
                color="border-orange-500"
              />
              <StatsCard
                icon={Globe}
                title="IP"
                value={result.ip_address}
                color="border-green-500"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Clé SSH
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(result.ssh_key)}
                  className="hover:scale-105 transition-transform"
                >
                  Copier
                </Button>
              </div>
              <code className="block bg-black text-green-400 p-3 rounded-lg text-sm overflow-x-auto">
                {result.ssh_key}
              </code>
            </div>
          </motion.div>
        ),
        duration: 10000,
      });

      router.push("/virtual-machines");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModelChange = (modelId: string) => {
    const model = vmModels.find((m) => m.id === Number(modelId));
    setSelectedModel(model || null);
    form.setValue("model_id", Number(modelId));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-8"
    >
      <div className="mb-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="outline"
            onClick={() => router.push("/virtual-machines")}
            className="group hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nouvelle Machine Virtuelle
          </h1>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="lg:col-span-2"
        >
          <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="text-2xl">Configuration</CardTitle>
              <CardDescription>
                Personnalisez votre nouvelle machine virtuelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Location Selection */}
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">
                              Localisation
                            </FormLabel>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {locations.map((location) => (
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  key={location}
                                  onClick={() => field.onChange(location)}
                                  className={`
                                    relative p-4 rounded-xl cursor-pointer
                                    transition-all duration-300
                                    ${field.value === location
                                      ? 'bg-blue-50 border-2 border-blue-500'
                                      : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-200'}
                                  `}
                                >
                                  <div className="flex items-center gap-3">
                                    <Globe className={`w-5 h-5 ${field.value === location ? 'text-blue-500' : 'text-gray-500'}`} />
                                    <span className="font-medium">{location}</span>
                                  </div>
                                  {field.value === location && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute top-2 right-2"
                                    >
                                      <Check className="w-4 h-4 text-blue-500" />
                                    </motion.div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* VM Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">
                              Nom de la machine
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="h-12 text-lg"
                                placeholder="ex: production-server-01"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Model Selection */}
                      <FormField
                        control={form.control}
                        name="model_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">
                              Modèle
                            </FormLabel>
                            <Select
                              onValueChange={handleModelChange}
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Sélectionnez un modèle" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {vmModels.map((model) => (
                                  <SelectItem
                                    key={model.id}
                                    value={model.id.toString()}
                                    className="py-3"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Server className="w-4 h-4" />
                                      <span>{model.distribution_name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      {/* Password */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">
                              Mot de passe root
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                className="h-12"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <span className="animate-spin">◌</span>
                            Création en cours...
                          </div>
                        ) : (
                          "Créer la machine virtuelle"
                        )}
                      </Button>
                    </motion.div>
                  </AnimatePresence>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="lg:sticky lg:top-8 h-fit"
        >
          <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-t-4 border-t-purple-500">
            <CardHeader>
              <CardTitle className="text-2xl">Résumé</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {selectedModel ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">CPU</span>
                        </div>
                        <p className="text-xl font-semibold">{selectedModel.cpu} cœurs</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          
                          <MemoryStick className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-600">RAM</span>
                        </div>
                        <p className="text-xl font-semibold">{selectedModel.ram} MB</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <HardDrive className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-600">Stockage</span>
                        </div>
                        <p className="text-xl font-semibold">{selectedModel.storage} GB</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Cloud className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">Type</span>
                        </div>
                        <p className="text-xl font-semibold">{selectedModel.distribution_name}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-500"
                  >
                    <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Sélectionnez un modèle pour voir les détails</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}