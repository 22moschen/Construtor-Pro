
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, PlusCircle, Trash2, Printer, DollarSign, Percent, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect, useCallback } from "react";
import type { Project, BudgetItem } from "@/types"; // Importar tipos atualizados
import { getProjectById, updateProject, addBudgetItemToProject, deleteBudgetItemFromProject } from "@/services/projectService"; // Importar serviços
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Em Andamento": return "bg-blue-500 text-white";
    case "Concluído": return "bg-green-500 text-white";
    case "Planejamento": return "bg-purple-500 text-white";
    case "Orçamento": return "bg-yellow-500 text-black";
    case "Aprovado": return "bg-teal-500 text-white";
    case "Cancelado": return "bg-red-500 text-white";
    default: return "bg-gray-500 text-white";
  }
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [bdiPercentage, setBdiPercentage] = useState<number>(25);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchProjectDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentProject = await getProjectById(params.id);
      if (currentProject) {
        setProject(currentProject);
        setBdiPercentage(currentProject.bdiPercentage || 25);
      } else {
        setProject(null);
        toast({ title: "Projeto não encontrado", variant: "destructive" });
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do projeto:", error);
      setProject(null);
      toast({ title: "Erro ao carregar projeto", description: "Tente novamente mais tarde.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    if (params.id) {
      fetchProjectDetails();
    }
  }, [fetchProjectDetails, params.id]);

  const handleBdiChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    let numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) {
        numericValue = 0;
    }
    setBdiPercentage(numericValue);

    if (project) {
        try {
            await updateProject(project.id, { bdiPercentage: numericValue });
            setProject(prev => prev ? {...prev, bdiPercentage: numericValue} : null);
        } catch (error) {
            console.error("Erro ao atualizar BDI no Firestore:", error);
            toast({ title: "Erro ao salvar BDI", variant: "destructive" });
            setBdiPercentage(project.bdiPercentage || 25); 
        }
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
     try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data Inválida';
      return format(date, "P", { locale: ptBR });
    } catch (e) {
      return 'Data Inválida';
    }
  };


  const handleAddBudgetItem = async () => {
    if (!project) return;
    const newItemName = prompt("Nome do novo item de orçamento:", "Novo Material de Teste");
    if (!newItemName) return;

    const newItem: BudgetItem = {
      id: `item-${Date.now()}`,
      type: "Material",
      name: newItemName,
      unit: "Un",
      quantity: 1,
      unitPrice: 10,
      total: 10
    };
    try {
      await addBudgetItemToProject(project.id, newItem);
      fetchProjectDetails();
      toast({ title: "Item Adicionado", description: `${newItem.name} adicionado ao orçamento.`});
    } catch (error) {
      console.error("Erro ao adicionar item ao orçamento:", error);
      toast({ title: "Erro ao adicionar item", variant: "destructive"});
    }
  };
  
  const handleDeleteBudgetItem = async (itemId: string, itemName: string) => {
    if (!project || !project.budgetItems) return;
    if (confirm(`Tem certeza que deseja excluir o item "${itemName}" do orçamento?`)) {
        try {
            await deleteBudgetItemFromProject(project.id, itemId);
            fetchProjectDetails();
            toast({ title: "Item Excluído", description: `${itemName} excluído do orçamento.`});
        } catch (error) {
            console.error("Erro ao excluir item do orçamento:", error);
            toast({ title: "Erro ao excluir item", variant: "destructive"});
        }
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 font-body text-lg">Carregando detalhes do projeto...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-8">
        <Link href="/dashboard/projects" className="flex items-center text-sm text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Projetos
        </Link>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-destructive">Projeto não encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body">O projeto que você está tentando acessar não foi encontrado.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/projects">Ver todos os projetos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const budgetItems: BudgetItem[] = project.budgetItems || [];
  const totalMaterialsCost = budgetItems.filter(item => item.type === "Material").reduce((sum, item) => sum + item.total, 0);
  const totalServicesCost = budgetItems.filter(item => item.type === "Serviço").reduce((sum, item) => sum + item.total, 0);
  const subTotalCost = totalMaterialsCost + totalServicesCost;
  const bdiValue = subTotalCost * (bdiPercentage / 100);
  const totalProjectCost = subTotalCost + bdiValue;

  return (
    <div className="space-y-8">
      <Link href="/dashboard/projects" className="flex items-center text-sm text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Projetos
      </Link>

      <Card className="shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="text-3xl font-headline flex items-center">
              {project.projectName}
              <Badge className={`ml-3 text-sm ${getStatusBadgeClass(project.status)}`}>{project.status}</Badge>
            </CardTitle>
            <CardDescription className="font-body mt-1">Detalhes e orçamento do projeto.</CardDescription>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/projects/edit/${project.id}`)}><Edit className="mr-2 h-4 w-4" /> Editar Projeto</Button>
            <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Imprimir Orçamento</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-headline mb-3">Informações do Projeto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm font-body">
              <div><strong>Cliente:</strong> {project.clientName}</div>
              <div><strong>Contato:</strong> {project.clientContact || "N/A"}</div>
              <div><strong>Endereço da Obra:</strong> {project.workAddress}</div>
              <div><strong>Data de Início:</strong> {formatDate(project.startDate)}</div>
              <div><strong>Data de Fim Prevista:</strong> {formatDate(project.endDate)}</div>
              <div><strong>Área Total:</strong> {project.totalArea || "N/A"}</div>
            </div>
            {project.description && (
              <div className="mt-4">
                <strong className="font-body">Descrição:</strong>
                <p className="text-muted-foreground font-body whitespace-pre-line">{project.description}</p>
              </div>
            )}
          </section>

          <Separator />

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-headline">Orçamento Detalhado</h2>
              <Button size="sm" variant="outline" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleAddBudgetItem}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Item
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-headline">Tipo</TableHead>
                  <TableHead className="font-headline">Descrição do Item</TableHead>
                  <TableHead className="font-headline">Unid.</TableHead>
                  <TableHead className="font-headline text-right">Qtd.</TableHead>
                  <TableHead className="font-headline text-right">Preço Unit. (R$)</TableHead>
                  <TableHead className="font-headline text-right">Custo Total (R$)</TableHead>
                  <TableHead className="font-headline text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetItems.map((item) => (
                  <TableRow key={item.id} className="font-body hover:bg-muted/50">
                    <TableCell>
                      <Badge variant={item.type === "Material" ? "secondary" : "outline"} className={item.type === "Material" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">{item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => alert(`Editar item ${item.name} (não implementado completamente)`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteBudgetItem(item.id, item.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {budgetItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8 font-body">
                      Nenhum item adicionado ao orçamento. Clique em "Adicionar Item" para começar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </section>

          <Separator />
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div></div>
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="font-headline text-lg">Resumo do Orçamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 font-body">
                <div className="flex justify-between">
                  <span>Custo Total de Materiais:</span>
                  <span className="font-semibold">R$ {totalMaterialsCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Custo Total de Mão de Obra:</span>
                  <span className="font-semibold">R$ {totalServicesCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-md font-semibold">
                  <span>Subtotal (Materiais + Mão de Obra):</span>
                  <span>R$ {subTotalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                 <div className="flex items-center justify-between space-x-2 pt-2">
                  <Label htmlFor="bdi" className="flex items-center shrink-0 font-body">
                    BDI / Lucro (%):
                    <Percent className="ml-1 h-4 w-4 text-muted-foreground" />
                  </Label>
                  <Input 
                    type="number" 
                    id="bdi" 
                    value={bdiPercentage} 
                    onChange={handleBdiChange}
                    className="max-w-[100px] text-right h-8 font-body"
                    step="0.1"
                  />
                </div>
                <div className="flex justify-between">
                  <span>Valor BDI / Lucro:</span>
                  <span className="font-semibold">R$ {bdiValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>CUSTO TOTAL DO PROJETO:</span>
                  <span>R$ {totalProjectCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </CardContent>
            </Card>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

    