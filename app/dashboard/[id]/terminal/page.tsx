"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Terminal as TerminalIcon,
  Copy,
  RefreshCw,
} from "lucide-react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { useVirtualMachines } from "@/hooks/useVirtualMachines";
import { useAuth } from "@/hooks/useAuth";
import { VirtualMachine } from "@/types/virtualMachine";

export default function TerminalPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { virtualMachines, fetchVirtualMachineById } = useVirtualMachines();

  const [vm, setVM] = useState<VirtualMachine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // 🔹 Récupération de la VM
  useEffect(() => {
    if (!id) return;

    const loadVM = async () => {
      setIsLoading(true);
      try {
       
        const data = await fetchVirtualMachineById(Number(id));
        setVM(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la machine virtuelle",
        });
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadVM();
  }, [id, fetchVirtualMachineById, toast, router]);

  // 🔹 Initialisation du terminal et WebSocket
  useEffect(() => {
    if (!terminalRef.current || vm?.status !== "running") return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "Menlo, Monaco, 'Courier New', monospace",
      theme: {
        background: "#1a1b1e",
        foreground: "#d4d4d4",
        cursor: "#ffffff",
        selectionBackground: "rgba(255, 255, 255, 0.3)",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    terminalInstance.current = term;

    const ws = new WebSocket(`ws://${window.location.host}/api/terminal/${id}`);

    ws.onopen = () => {
      setIsConnected(true);
      term.write("\r\n🔌 Connecté au terminal SSH\r\n\n");
    };

    ws.onmessage = (event) => term.write(event.data);

    ws.onclose = () => {
      setIsConnected(false);
      term.write("\r\n\n🔴 Connexion terminée\r\n");
    };

    ws.onerror = () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur de connexion au terminal",
      });
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    wsRef.current = ws;

    const handleResize = () => {
      fitAddon.fit();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "resize",
            cols: term.cols,
            rows: term.rows,
          })
        );
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      term.dispose();
      if (ws.readyState === WebSocket.OPEN) ws.close();
      window.removeEventListener("resize", handleResize);
    };
  }, [vm, id, toast]);

  // 🔹 Copier la commande SSH
  const copySSHCommand = () => {
    if (!vm?.ip_address || !vm?.ssh_port) return;
    const command = `ssh -p ${vm.ssh_port} user@${vm.ip_address}`;
    navigator.clipboard.writeText(command);

    toast({
      title: "Copié !",
      description: "Commande SSH copiée dans le presse-papiers",
    });
  };

  // 🔹 Chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!vm) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/dashboard/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Terminal SSH</h1>
            <p className="text-muted-foreground">{vm.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copySSHCommand} disabled={!vm.ip_address || !vm.ssh_port}>
            <Copy className="mr-2 h-4 w-4" />
            Copier la commande SSH
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Console</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? "Connecté" : "Déconnecté"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {vm.status === "running" ? (
            <div ref={terminalRef} className="h-[500px] rounded-lg overflow-hidden bg-[#1a1b1e]" />
          ) : (
            <div className="h-[500px] flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <TerminalIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  La machine virtuelle doit être démarrée pour accéder au terminal
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
