
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Eye, MoreHorizontal, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/types"; // Importar o tipo Project atualizado
import { getProjects, deleteProject } from "@/services/projectService"; // Importar serviços
import { useToast } from "@/hooks/use-toast"; // Para notificações
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const getStatusBadgeVariant = (status: string) => {
  // Mantém a lógica anterior, ou ajuste conforme preferir
  switch (status) {
    case "Em Andamento": return "default";
    case "Concluído": return "secondary";
    default: return "outline";
  }
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


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      toast({
        title: "Erro ao buscar projetos",
        description: "Não foi possível carregar a lista de projetos. Tente recarregar a página.",
        variant: "destructive",
      });
      setProjects([]); // Limpa os projetos em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (confirm(`Tem certeza que deseja excluir o projeto "${projectName}"? Esta ação não poderá ser desfeita.`)) {
      try {
        await deleteProject(projectId);
        setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
        toast({
          title: "Projeto Excluído!",
          description: `O projeto "${projectName}" foi excluído com sucesso.`,
        });
      } catch (error) {
        console.error("Erro ao excluir projeto:", error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o projeto. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      // Tenta converter para Date assumindo que é uma string ISO ou um objeto Date já convertido
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data Inválida';
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return 'Data Inválida';
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-headline text-foreground">Gerenciamento de Projetos</h1>
        <Link href="/dashboard/projects/new">
          <Button className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Lista de Projetos</CardTitle>
          <CardDescription className="font-body">Visualize e gerencie todos os seus projetos de construção.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 font-body">Carregando projetos...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-headline">Nome do Projeto</TableHead>
                  <TableHead className="font-headline">Cliente</TableHead>
                  <TableHead className="font-headline">Status</TableHead>
                  <TableHead className="font-headline">Data Início</TableHead>
                  <TableHead className="font-headline">Data Fim</TableHead>
                  <TableHead className="font-headline text-right">Orçamento (R$)</TableHead>
                  <TableHead className="font-headline text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="font-body hover:bg-muted/50">
                    <TableCell className="font-medium">{project.projectName}</TableCell>
                    <TableCell>{project.clientName}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(project.status) as any} className={getStatusBadgeClass(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(project.startDate)}</TableCell>
                    <TableCell>{formatDate(project.endDate)}</TableCell>
                    <TableCell className="text-right">
                      {project.budget !== undefined ? project.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/projects/${project.id}`} className="flex items-center cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" /> Detalhes / Orçamento
                            </Link>
                          </DropdownMenuItem>
                          {/* A edição levaria a uma página nova ou a um modal, por simplicidade, vamos assumir uma nova página */}
                           <DropdownMenuItem asChild>
                             <Link href={`/dashboard/projects/edit/${project.id}`} className="flex items-center cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </Link>
                           </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProject(project.id, project.projectName)} 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
           {!isLoading && projects.length === 0 && <p className="text-center text-muted-foreground font-body py-8">Nenhum projeto cadastrado.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
