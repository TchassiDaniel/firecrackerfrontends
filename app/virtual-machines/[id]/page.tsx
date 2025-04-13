"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  Download,
  Copy,
  MemoryStick,
  Network,
  DoorClosedIcon as CloseIcon,
  Play,
  Pause,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useVirtualMachines } from "@/hooks/useVirtualMachines";
import { useAuth } from "@/hooks/useAuth";
import type { VirtualMachine, VMMetrics } from "@/types/virtualMachine";

const VirtualMachinePage = () => {
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();
  const {
    virtualMachines,
    isLoading,
    error,
    fetchVirtualMachineById,
    fetchUserVirtualMachines,
    updateVirtualMachineStatus,
  } = useVirtualMachines();

  const [metrics, setMetrics] = useState<{
    cpu: VMMetrics[];
    ram: VMMetrics[];
    storage: VMMetrics[];
    network: VMMetrics[];
  }>({
    cpu: [],
    ram: [],
    storage: [],
    network: [],
  });

  const [activeMetrics, setActiveMetrics] = useState({
    cpu: false, // CPU désactivé par défaut
    ram: true,
    storage: false, // Storage désactivé par défaut
    network: true,
  });

  const [vmData, setVmData] = useState<VirtualMachine | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id && user?.id) {
      // Fetch the specific VM data
      fetchVirtualMachineById(Number(id))
        .then((vm) => {
          setVmData(vm);
          // Initialize metrics with VM data
          if (vm.metrics) {
            const now = new Date();
            const initialPoint: VMMetrics = {
              cpu_usage: vm.metrics.cpu_usage,
              memory_usage: vm.metrics.memory_usage,
              disk_usage: vm.metrics.disk_usage,
              network_rx_bytes: vm.metrics.network_rx_bytes,
              network_tx_bytes: vm.metrics.network_tx_bytes,
              disk_read_bytes: vm.metrics.disk_read_bytes,
              disk_write_bytes: vm.metrics.disk_write_bytes,
            };
            setMetrics({
              cpu: [initialPoint],
              ram: [initialPoint],
              storage: [initialPoint],
              network: [initialPoint],
            });
          }
        })
        .catch((err) => console.error("Error fetching VM data:", err));
    }
  }, [id, user?.id, fetchVirtualMachineById]);

  // Function to simulate real-time metrics
  const fetchMetrics = useCallback(() => {
    if (vmData) {
      const now = new Date();
      const newPoint: VMMetrics = {
        cpu_usage: Math.random() * 100,
        memory_usage: Math.random() * 100,
        disk_usage: Math.random() * 100,
        network_rx_bytes: Math.random() * 1000000,
        network_tx_bytes: Math.random() * 1000000,
        disk_read_bytes: Math.random() * 1000000,
        disk_write_bytes: Math.random() * 1000000,
      };

      setMetrics((prev) => ({
        cpu: [...prev.cpu.slice(-20), newPoint],
        ram: [...prev.ram.slice(-20), newPoint],
        storage: [...prev.storage.slice(-20), newPoint],
        network: [...prev.network.slice(-20), newPoint],
      }));
    }
  }, [vmData]);

  useEffect(() => {
    const interval = setInterval(fetchMetrics, 1000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const handleCopySSHKey = () => {
    navigator.clipboard.writeText(vmData?.ssh_key || "");
    alert("Clé SSH copiée !");
  };

  const handleDownloadSSHKey = () => {
    const blob = new Blob([vmData?.ssh_key || ""], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ssh_key_${vmData?.name}.pem`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const toggleMetric = (metric: "cpu" | "ram" | "storage" | "network") => {
    setActiveMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  const handleVMAction = async (action: "start" | "stop" | "pause") => {
    if (!vmData?.id) return;

    setActionLoading(action);
    try {
      await updateVirtualMachineStatus(vmData.id, action);
      // VM status will be updated in the virtualMachines state by the function
    } catch (error) {
      console.error(`Failed to ${action} VM:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteVM = async () => {
    if (!vmData?.id) return;

    setActionLoading("delete");
    try {
      // Assuming there's a deleteVirtualMachine function in the hook
      // If not, you would need to implement the API call here
      await deleteVirtualMachine(vmData.id);
      // Redirect to VM list page after successful deletion
      window.location.href = "/virtual-machines";
    } catch (error) {
      console.error("Failed to delete VM:", error);
    } finally {
      setActionLoading(null);
      setShowDeleteConfirm(false);
    }
  };

  // Mock function if deleteVirtualMachine doesn't exist in the hook
  const deleteVirtualMachine = async (id: number) => {
    // This is a placeholder. Replace with actual implementation
    console.log(`Deleting VM with ID: ${id}`);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow"
          >
            <ArrowLeft className="mr-2" /> Retour
          </motion.button>

          <h1 className="text-2xl font-bold">{vmData?.name}</h1>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={actionLoading !== null || vmData?.status === "paused"}
              onClick={() => handleVMAction("pause")}
              className={`flex items-center px-4 py-2 rounded-lg shadow ${
                vmData?.status === "paused"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-amber-500 text-white hover:bg-amber-600"
              }`}
            >
              {actionLoading === "pause" ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Pause className="mr-2 h-5 w-5" />
              )}
              Mettre en pause
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={actionLoading !== null || vmData?.status === "running"}
              onClick={() => handleVMAction("start")}
              className={`flex items-center px-4 py-2 rounded-lg shadow ${
                vmData?.status === "running"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {actionLoading === "start" ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Play className="mr-2 h-5 w-5" />
              )}
              Démarrer
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={actionLoading !== null}
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
            >
              {actionLoading === "delete" ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Trash2 className="mr-2 h-5 w-5" />
              )}
              Supprimer
            </motion.button>
          </div>
        </div>

        {/* VM Status Indicator */}
        <div className="mt-4 flex items-center">
          <div
            className={`h-3 w-3 rounded-full mr-2 ${
              vmData?.status === "running"
                ? "bg-green-500"
                : vmData?.status === "paused"
                ? "bg-amber-500"
                : vmData?.status === "stopped"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
          ></div>
          <span className="text-sm text-gray-600">
            Status:{" "}
            {vmData?.status === "running"
              ? "En cours d'exécution"
              : vmData?.status === "paused"
              ? "En pause"
              : vmData?.status === "stopped"
              ? "Arrêtée"
              : "Inconnu"}
          </span>
        </div>
      </div>

      {/* SSH Key Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Clé SSH</h2>
        <div className="flex gap-4">
          <button
            onClick={handleCopySSHKey}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Copy className="mr-2" /> Copier la clé
          </button>
          <button
            onClick={handleDownloadSSHKey}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Download className="mr-2" /> Télécharger la clé
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Metrics Toggles */}
        <div className="col-span-full bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex flex-wrap gap-4">
            {/* Afficher uniquement les boutons pour RAM et Network */}
            <button
              onClick={() => toggleMetric("ram")}
              className={`flex items-center px-3 py-1 rounded ${
                activeMetrics.ram
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              RAM
              {activeMetrics.ram && <CloseIcon className="ml-2 h-4 w-4" />}
            </button>
            <button
              onClick={() => toggleMetric("network")}
              className={`flex items-center px-3 py-1 rounded ${
                activeMetrics.network
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              NETWORK
              {activeMetrics.network && <CloseIcon className="ml-2 h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Metrics Charts - Seulement RAM et Network */}
        {activeMetrics.ram && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <MemoryStick className="mr-2" /> RAM Usage
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.ram}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="memory_usage"
                    stroke="#10B981"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeMetrics.network && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <Network className="mr-2" /> Network Usage
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.network}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="network_rx_bytes"
                    stroke="#EC4899"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer la machine virtuelle{" "}
              <strong>{vmData?.name}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                disabled={actionLoading === "delete"}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteVM}
                className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center"
                disabled={actionLoading === "delete"}
              >
                {actionLoading === "delete" ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Trash2 className="mr-2 h-5 w-5" />
                )}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualMachinePage;
