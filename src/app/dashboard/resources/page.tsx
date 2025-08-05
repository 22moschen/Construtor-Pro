
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Material, Service } from "@/types"; // Importar tipos atualizados
import { 
  getMaterials, saveMaterial, deleteMaterial, 
  getServices, saveService, deleteService 
} from "@/services/resourceService"; // Importar serviços
import { useToast } from "@/hooks/use-toast";

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("materials");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Estados para o modal de Material
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Partial<Material>>({});
  const [isEditingMaterial, setIsEditingMaterial] = useState(false);

  // Estados para o modal de Serviço
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});
  const [isEditingService, setIsEditingService] = useState(false);
  
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  // Estados para o diálogo de exclusão
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'material' | 'service'; name: string } | null>(null);

  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedMaterials = await getMaterials();
      setMaterials(fetchedMaterials);
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
      toast({ title: "Erro ao buscar materiais", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedServices = await getServices();
      setServices(fetchedServices);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      toast({ title: "Erro ao buscar serviços", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (activeTab === "materials") {
      fetchMaterials();
    } else {
      fetchServices();
    }
  }, [activeTab, fetchMaterials, fetchServices]);

  const handleOpenAddModal = () => {
    if (activeTab === "materials") {
      setIsEditingMaterial(false);
      setCurrentMaterial({ name: "", unit: "", price: 0, supplier: "", code: "" });
      setIsMaterialModalOpen(true);
    } else {
      setIsEditingService(false);
      setCurrentService({ name: "", unit: "", price: 0 });
      setIsServiceModalOpen(true);
    }
  };

  const handleOpenEditMaterialModal = (material: Material) => {
    setIsEditingMaterial(true);
    setCurrentMaterial({ ...material });
    setIsMaterialModalOpen(true);
  };

  const handleOpenEditServiceModal = (service: Service) => {
    setIsEditingService(true);
    setCurrentService({ ...service });
    setIsServiceModalOpen(true);
  };
  
  const handleSaveMaterial = async () => {
    if (!currentMaterial.name || !currentMaterial.unit || currentMaterial.price === undefined) {
      toast({ title: "Campos obrigatórios", description: "Nome, unidade e preço são obrigatórios.", variant: "destructive"});
      return;
    }
    setIsSubmittingModal(true);
    try {
      await saveMaterial(currentMaterial);
      toast({ title: "Material Salvo!", description: `O material "${currentMaterial.name}" foi salvo.`});
      setIsMaterialModalOpen(false);
      fetchMaterials(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao salvar material:", error);
      toast({ title: "Erro ao salvar material", variant: "destructive"});
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleSaveService = async () => {
     if (!currentService.name || !currentService.unit || currentService.price === undefined) {
      toast({ title: "Campos obrigatórios", description: "Nome, unidade e preço são obrigatórios.", variant: "destructive"});
      return;
    }
    setIsSubmittingModal(true);
    try {
      await saveService(currentService);
      toast({ title: "Serviço Salvo!", description: `O serviço "${currentService.name}" foi salvo.`});
      setIsServiceModalOpen(false);
      fetchServices(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      toast({ title: "Erro ao salvar serviço", variant: "destructive"});
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleOpenDeleteDialog = (id: string, type: 'material' | 'service', name: string) => {
    setItemToDelete({ id, type, name });
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    setIsSubmittingModal(true);
    try {
      if (itemToDelete.type === 'material') {
        await deleteMaterial(itemToDelete.id);
        toast({ title: "Material Excluído!", description: `"${itemToDelete.name}" foi excluído.`});
        fetchMaterials();
      } else {
        await deleteService(itemToDelete.id);
        toast({ title: "Serviço Excluído!", description: `"${itemToDelete.name}" foi excluído.`});
        fetchServices();
      }
    } catch (error) {
      console.error(`Erro ao excluir ${itemToDelete.type}:`, error);
      toast({ title: `Erro ao excluir ${itemToDelete.type}`, variant: "destructive"});
    } finally {
      setIsDeleteConfirmationOpen(false);
      setItemToDelete(null);
      setIsSubmittingModal(false);
    }
  };

  const handleMaterialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentMaterial(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentService(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const renderLoading = () => (
    <div className="flex justify-center items-center py-10">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 font-body">Carregando...</p>
    </div>
  );

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
              {isLoading ? renderLoading() : (
                <>
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
                                <DropdownMenuItem onClick={() => handleOpenDeleteDialog(material.id, 'material', material.name)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
                </>
              )}
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
              {isLoading ? renderLoading() : (
                <>
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
                                <DropdownMenuItem onClick={() => handleOpenDeleteDialog(service.id, 'service', service.name)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para Adicionar/Editar Material */}
      <Dialog open={isMaterialModalOpen} onOpenChange={setIsMaterialModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{isEditingMaterial ? "Editar Material" : "Adicionar Novo Material"}</DialogTitle>
            <DialogDescription className="font-body">
              {isEditingMaterial ? "Atualize os detalhes do material." : "Preencha os detalhes do novo material."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materialName" className="text-right font-body">Nome*</Label>
              <Input id="materialName" name="name" value={currentMaterial.name || ""} onChange={handleMaterialInputChange} className="col-span-3 font-body" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materialUnit" className="text-right font-body">Unidade*</Label>
              <Input id="materialUnit" name="unit" value={currentMaterial.unit || ""} onChange={handleMaterialInputChange} className="col-span-3 font-body" placeholder="Ex: Un, m², kg, Saco"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materialPrice" className="text-right font-body">Preço (R$)*</Label>
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
            <Button variant="outline" onClick={() => setIsMaterialModalOpen(false)} disabled={isSubmittingModal}>Cancelar</Button>
            <Button onClick={handleSaveMaterial} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmittingModal}>
              {isSubmittingModal ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isEditingMaterial ? "Salvar Alterações" : "Salvar Material"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Adicionar/Editar Serviço */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{isEditingService ? "Editar Serviço" : "Adicionar Novo Serviço"}</DialogTitle>
            <DialogDescription className="font-body">
              {isEditingService ? "Atualize os detalhes do serviço." : "Preencha os detalhes do novo serviço."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceName" className="text-right font-body">Nome*</Label>
              <Input id="serviceName" name="name" value={currentService.name || ""} onChange={handleServiceInputChange} className="col-span-3 font-body" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceUnit" className="text-right font-body">Unidade*</Label>
              <Input id="serviceUnit" name="unit" value={currentService.unit || ""} onChange={handleServiceInputChange} className="col-span-3 font-body" placeholder="Ex: m², m³, Ponto, Vb" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="servicePrice" className="text-right font-body">Preço (R$)*</Label>
              <Input id="servicePrice" name="price" type="number" step="0.01" value={currentService.price || ""} onChange={handleServiceInputChange} className="col-span-3 font-body" />
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsServiceModalOpen(false)} disabled={isSubmittingModal}>Cancelar</Button>
            <Button onClick={handleSaveService} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmittingModal}>
               {isSubmittingModal ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
               {isEditingService ? "Salvar Alterações" : "Salvar Serviço"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para Confirmação de Exclusão */}
      <AlertDialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              Tem certeza que deseja excluir "{itemToDelete?.name}"? Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteConfirmationOpen(false)} disabled={isSubmittingModal}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" disabled={isSubmittingModal}>
              {isSubmittingModal ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
