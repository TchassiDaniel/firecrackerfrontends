// types/virtualMachine.ts
export type VMStatus = 'running' | 'stopped' | 'paused';

export interface VMUser {
  id: number;
  name: string;
  email: string;
}

export interface SystemImage {
  id: number;
  name: string;
  version: string;
  description: string;
  size_gb: number;
  created_at: string;
}

export interface VMmodels {
  id: number;
  distribution_name: string;
  cpu: number;
  storage: number;
  ram: number;
  kernel_base_path: string;
  rootfs_base_path: string;
  rootfs_download_url: string;
}

export interface VMMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_rx_bytes: number;
  network_tx_bytes: number;
  disk_read_bytes: number;
  disk_write_bytes: number;
}

export interface VMStatusHistory {
  id: number;
  status: VMStatus;
  created_at: string;
}

export interface VmCreate {
  name: string;
  password: string;
  owner_id?: number;
  model_id: number;
  location: string;
  host_id?: number;
}

export interface VirtualMachine {
  id: number;
  name: string;
  status: VMStatus;
  vcpu_count: number;
  memory_size_mib: number;
  description: string;
  disk_size_gb: number;
  created_at: string;
  ip_address: string;
  mac_address: string;
  tap_device_name: string;
  tap_ip: string;
  ssh_port: number;
  user: VMUser;
  systemImage: SystemImage;
  vmModels: VMmodels;
  metrics: VMMetrics;
}

export interface VMLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export interface CreateVMPayload {
  name: string;
  vcpu_count: number;
  memory_size_mib: number;
  disk_size_gb: number;
  system_image_id: number;
}

export interface UpdateVMPayload {
  name?: string;
}