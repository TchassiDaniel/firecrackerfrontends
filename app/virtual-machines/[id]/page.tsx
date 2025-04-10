import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, Download, Copy, Cpu, MemoryStick , HardDrive, Network,
  X as CloseIcon 
} from "lucide-react";
import { useParams } from "next/navigation";
import { useVirtualMachines } from "@/hooks/useVirtualMachines";
import { useAuth } from "@/hooks/useAuth";
import { VirtualMachine, VMMetrics } from "@/types/virtualMachine";

const VirtualMachinePage = () => {
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();
  const { 
    virtualMachines, 
    isLoading, 
    error,
    fetchVirtualMachineById,
    fetchUserVirtualMachines
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
    network: []
  });
  
  const [activeMetrics, setActiveMetrics] = useState({
    cpu: true,
    ram: true,
    storage: true,
    network: true
  });

  const [vmData, setVmData] = useState<VirtualMachine | null>(null);

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
              disk_write_bytes: vm.metrics.disk_write_bytes
            };
            setMetrics({
              cpu: [initialPoint],
              ram: [initialPoint],
              storage: [initialPoint],
              network: [initialPoint]
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
        disk_write_bytes: Math.random() * 1000000
      };

      setMetrics(prev => ({
        cpu: [...prev.cpu.slice(-20), newPoint],
        ram: [...prev.ram.slice(-20), newPoint],
        storage: [...prev.storage.slice(-20), newPoint],
        network: [...prev.network.slice(-20), newPoint]
      }));
    }
  }, [vmData]);

  useEffect(() => {
    const interval = setInterval(fetchMetrics, 1000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const handleCopySSHKey = () => {
    navigator.clipboard.writeText(vmData?.ssh_key || '');
    alert("Clé SSH copiée !");
  };

  const handleDownloadSSHKey = () => {
    const blob = new Blob([vmData?.ssh_key || ''], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ssh_key_${vmData?.name}.pem`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const toggleMetric = (metric: 'cpu' | 'ram' | 'storage' | 'network') => {
    setActiveMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
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
            {Object.entries(activeMetrics).map(([metric, isActive]) => (
              <button
                key={metric}
                onClick={() => toggleMetric(metric as 'cpu' | 'ram' | 'storage' | 'network')}
                className={`flex items-center px-3 py-1 rounded ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {metric.toUpperCase()}
                {isActive && <CloseIcon className="ml-2 h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Charts */}
        {activeMetrics.cpu && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <Cpu className="mr-2" /> CPU Usage
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.cpu}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cpu_usage" stroke="#3B82F6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

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
                  <Line type="monotone" dataKey="memory_usage" stroke="#10B981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeMetrics.storage && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <HardDrive className="mr-2" /> Storage Usage
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.storage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="disk_usage" stroke="#F59E0B" />
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
                  <Line type="monotone" dataKey="network_rx_bytes" stroke="#EC4899" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualMachinePage;