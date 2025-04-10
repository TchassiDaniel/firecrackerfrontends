// types/adminVM.ts
export interface AdminVirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'creating';
  vcpu_count: number;
  memory_size_mib: number;
  disk_size_gb: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  metrics?: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
  };
  created_at: string;
}

export interface AdminVMFilters {
  status?: string;
  userId?: string;
  search?: string;
  page?: number;
}

export interface AdminVMPagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface AdminVMResponse {
  data: AdminVirtualMachine[];
  pagination: AdminVMPagination;
}