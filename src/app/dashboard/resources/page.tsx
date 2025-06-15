
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Tipos para os dados
interface Material {
  id: string;
  name: string;
  unit: string;
  price: number;
  supplier?: string;
  code?: string;
}

interface Service {
  id: string;
  name: string;
  unit: string;
  price: number;
}

// Mock data inicial
const initialMaterials: Material[] = [
  { id: "1", name: "Tijolo Cerâmico 8 Furos", unit: "Unidade", price: 0.80, supplier: "Cerâmica Boa Vista", code: "TJ001" },
  { id: "2", name: "Cimento CPII Saco 50kg", unit: "Saco", price: 28.50, supplier: "Cimentos Forte", code: "CM002" },
  { id: "3", name: "Areia Média Lavada", unit: "m³", price: 120.00, supplier: "Areial Pedreira", code: "AR001" },
  { id: "4", name: "Brita 1", unit: "m³", price: 150.00, supplier: "Areial Pedreira", code: "BR001" },
];

const initialServices: Service[] = [
  { id: "1", name: "Assentamento de Alvenaria", unit: "m²", price: 25.00 },
  { id: "2", name: "Instalação Elétrica Ponto", unit: "Ponto", price: 70.00 },
  { id: "3", name: "Pintura Látex (2 demãos)", unit: "m²", price: 18.00 },
  { id: "4", name: "Escavação Manual", unit: "m³", price: 90.00 },
];


export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("materials");
  
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [services, setServices] = useState<Service[]>(initialServices);

  // Estados para o modal de Material
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Partial<Material>>({});
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);

  // Estados para o modal de Serviço
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Estados para o diálogo de exclusão
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'material' | 'service' } | null>(null);

  const handleOpenAddModal = () => {
    if (activeTab === "materials") {
      setEditingMaterialId(null);
      setCurrentMaterial({ name: "", unit: "", price: 0, supplier: "", code: "" });
      setIsMaterialModalOpen(true);
    } else {
      setEditingServiceId(null);
      setCurrentService({ name: "", unit: "", price: 0 });
      setIsServiceModalOpen(true);
    }
  };

  const handleOpenEditMaterialModal = (material: Material) => {
    setEditingMaterialId(material.id);
    setCurrentMaterial({ ...material });
    setIsMaterialModalOpen(true);
  };

  const handleOpenEditServiceModal = (service: Service) => {
    setEditingServiceId(service.id);
    setCurrentService({ ...service });
    setIsServiceModalOpen(true);
  };
  
  const handleSaveMaterial = () => {
    if (editingMaterialId) { // Editar
      setMaterials(materials.map(m => m.id === editingMaterialId ? { ...currentMaterial, id: editingMaterialId } as Material : m));
    } else { // Adicionar
      setMaterials([...materials, { ...currentMaterial, id: String(Date.now()) } as Material]);
    }
    setIsMaterialModalOpen(false);
  };

  const handleSaveService = () => {
    if (editingServiceId) { // Editar
      setServices(services.map(s => s.id === editingServiceId ? { ...currentService, id: editingServiceId } as Service : s));
    } else { // Adicionar
      setServices([...services, { ...currentService, id: String(Date.now()) } as Service]);
    }
    setIsServiceModalOpen(false);
  };

  const handleOpenDeleteDialog = (id: string, type: 'material' | 'service') => {
    setItemToDelete({ id, type });
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'material') {
        setMaterials(materials.filter(m => m.id !== itemToDelete.id));
      } else {
        setServices(services.filter(s => s.id !== itemToDelete.id));
      }
    }
    setIsDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };

  const handleMaterialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentMaterial(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentService(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-headline text-foreground">Cadastro Base de Recursos</h1>
      </div>

      <Tabs defaultValue="materials" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="materials" className="font-headline">Materiais</TabsTrigger>
            <TabsTrigger value="services" className="font-headline">Serviços (Mão de Obra)</TabsTrigger>
          </TabsList>
           <Button onClick={handleOpenAddModal} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Novo {activeTab === "materials" ? "Material" : "Serviço"}
            </Button>
        </div>
        
        <TabsContent value="materials">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline">Lista de Materiais</CardTitle>
              <CardDescription className="font-body">Gerencie os materiais utilizados em seus projetos.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-headline">Nome do Material</TableHead>
                    <TableHead className="font-headline">Unidade</TableHead>
                    <TableHead className="font-headline text-right">Preço Unit. (R$)</TableHead>
                    <TableHead className="font-headline">Fornecedor</TableHead>
                    <TableHead className="font-headline">Código</TableHead>
                    <TableHead className="font-headline text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow key={material.id} className="font-body hover:bg-muted/50">
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell className="text-right">{material.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{material.supplier || "N/A"}</TableCell>
                      <TableCell>{material.code || "N/A"}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEditMaterialModal(material)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDeleteDialog(material.id, 'material')} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {materials.length === 0 && <p className="text-center text-muted-foreground font-body py-8">Nenhum material cadastrado.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline">Lista de Serviços (Mão de Obra)</CardTitle>
              <CardDescription className="font-body">Gerencie os serviços e custos de mão de obra.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-headline">Nome do Serviço</TableHead>
                    <TableHead className="font-headline">Unidade de Cobrança</TableHead>
                    <TableHead className="font-headline text-right">Preço Unit. (R$)</TableHead>
                    <TableHead className="font-headline text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id} className="font-body hover:bg-muted/50">
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.unit}</TableCell>
                      <TableCell className="text-right">{service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-center">
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEditServiceModal(service)}>
                                <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDeleteDialog(service.id, 'service')} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {services.length === 0 && <p className="text-center text-muted-foreground font-body py-8">Nenhum serviço cadastrado.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para Adicionar/Editar Material */}
      <Dialog open={isMaterialModalOpen} onOpenChange={setIsMaterialModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingMaterialId ? "Editar Material" : "Adicionar Novo Material"}</DialogTitle>
            <DialogDescription className="font-body">
              {editingMaterialId ? "Atualize os detalhes do material." : "Preencha os detalhes do novo material."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materialName" className="text-right font-body">Nome</Label>
              <Input id="materialName" name="name" value={currentMaterial.name || ""} onChange={handleMaterialInputChange} className="col-span-3 font-body" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materialUnit" className="text-right font-body">Unidade</Label>
              <Input id="materialUnit" name="unit" value={currentMaterial.unit || ""} onChange={handleMaterialInputChange} className="col-span-3 font-body" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materialPrice" className="text-right font-body">Preço (R$)</Label>
              <Input id="materialPrice" name="price" type="number" step="0.01" value={currentMaterial.price || ""} onChange={handleMaterialInputChange} className="col-span-3 font-body" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materialSupplier" className="text-right font-body">Fornecedor</Label>
              <Input id="materialSupplier" name="supplier" value={currentMaterial.supplier || ""} onChange={handleMaterialInputChange} className="col-span-3 font-body" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materialCode" className="text-right font-body">Código</Label>
              <Input id="materialCode" name="code" value={currentMaterial.code || ""} onChange={handleMaterialInputChange} className="col-span-3 font-body" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMaterialModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveMaterial} className="bg-primary hover:bg-primary/90 text-primary-foreground">Salvar Material</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Adicionar/Editar Serviço */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingServiceId ? "Editar Serviço" : "Adicionar Novo Serviço"}</DialogTitle>
            <DialogDescription className="font-body">
              {editingServiceId ? "Atualize os detalhes do serviço." : "Preencha os detalhes do novo serviço."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceName" className="text-right font-body">Nome</Label>
              <Input id="serviceName" name="name" value={currentService.name || ""} onChange={handleServiceInputChange} className="col-span-3 font-body" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceUnit" className="text-right font-body">Unidade</Label>
              <Input id="serviceUnit" name="unit" value={currentService.unit || ""} onChange={handleServiceInputChange} className="col-span-3 font-body" placeholder="Ex: m², m³, ponto, vb" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="servicePrice" className="text-right font-body">Preço (R$)</Label>
              <Input id="servicePrice" name="price" type="number" step="0.01" value={currentService.price || ""} onChange={handleServiceInputChange} className="col-span-3 font-body" />
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveService} className="bg-primary hover:bg-primary/90 text-primary-foreground">Salvar Serviço</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para Confirmação de Exclusão */}
      <AlertDialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              Tem certeza que deseja excluir este item? Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteConfirmationOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
