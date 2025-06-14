"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, PlusCircle, Trash2, Printer, DollarSign, Percent } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data - replace with actual data fetching based on params.id
const projectData = {
  id: "1",
  name: "Construção Residencial Alpha",
  client: "João Silva",
  contact: "(11) 98765-4321",
  address: "Rua das Palmeiras, 123, Bairro Sol Nascente, Cidade Feliz - SP",
  description: "Construção de uma residência unifamiliar térrea com 3 quartos, sala, cozinha, 2 banheiros e área de serviço. Área total de 150m².",
  startDate: "01/03/2024",
  endDate: "30/09/2024",
  status: "Em Andamento",
  totalArea: "150m²",
  budgetItems: [
    { id: "m1", type: "Material", name: "Tijolo Cerâmico 8 Furos", unit: "Milheiro", quantity: 15, unitPrice: 800, total: 12000 },
    { id: "m2", type: "Material", name: "Cimento CPII Saco 50kg", unit: "Saco", quantity: 200, unitPrice: 28, total: 5600 },
    { id: "s1", type: "Serviço", name: "Assentamento de Alvenaria", unit: "m²", quantity: 300, unitPrice: 25, total: 7500 },
    { id: "s2", type: "Serviço", name: "Instalação Elétrica Ponto", unit: "Ponto", quantity: 80, unitPrice: 70, total: 5600 },
  ],
  bdiPercentage: 25, // Example BDI
};

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
  // In a real app, fetch project by params.id
  const project = projectData; 

  if (!project) {
    return <p>Projeto não encontrado.</p>;
  }

  const totalMaterialsCost = project.budgetItems.filter(item => item.type === "Material").reduce((sum, item) => sum + item.total, 0);
  const totalServicesCost = project.budgetItems.filter(item => item.type === "Serviço").reduce((sum, item) => sum + item.total, 0);
  const subTotalCost = totalMaterialsCost + totalServicesCost;
  const bdiValue = subTotalCost * (project.bdiPercentage / 100);
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
              {project.name}
              <Badge className={`ml-3 text-sm ${getStatusBadgeClass(project.status)}`}>{project.status}</Badge>
            </CardTitle>
            <CardDescription className="font-body mt-1">Detalhes e orçamento do projeto.</CardDescription>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Editar Projeto</Button>
            <Button variant="outline"><Printer className="mr-2 h-4 w-4" /> Imprimir Orçamento</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Info Section */}
          <section>
            <h2 className="text-xl font-headline mb-3">Informações do Projeto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm font-body">
              <div><strong>Cliente:</strong> {project.client}</div>
              <div><strong>Contato:</strong> {project.contact}</div>
              <div><strong>Endereço da Obra:</strong> {project.address}</div>
              <div><strong>Data de Início:</strong> {project.startDate}</div>
              <div><strong>Data de Fim Prevista:</strong> {project.endDate}</div>
              <div><strong>Área Total:</strong> {project.totalArea}</div>
            </div>
            {project.description && (
              <div className="mt-4">
                <strong className="font-body">Descrição:</strong>
                <p className="text-muted-foreground font-body whitespace-pre-line">{project.description}</p>
              </div>
            )}
          </section>

          <Separator />

          {/* Budgeting Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-headline">Orçamento Detalhado</h2>
              <Button size="sm" variant="outline" className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
                {project.budgetItems.map((item) => (
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
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {project.budgetItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Nenhum item adicionado ao orçamento.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </section>

          <Separator />
          
          {/* Budget Summary Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div> {/* Empty div for layout, or add more project details here */} </div>
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
                  <Label htmlFor="bdi" className="flex items-center shrink-0">
                    BDI / Lucro (%):
                    <Percent className="ml-1 h-4 w-4 text-muted-foreground" />
                  </Label>
                  <Input 
                    type="number" 
                    id="bdi" 
                    defaultValue={project.bdiPercentage} 
                    className="max-w-[100px] text-right h-8"
                    // Add onChange to update BDI state
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
