
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Removido CardFooter não utilizado
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "./new/page"; // Importar o tipo Project

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Em Andamento": return "default";
    case "Concluído": return "secondary";
    case "Planejamento": return "outline";
    case "Orçamento": return "outline";
    case "Aprovado": return "default";
    default: return "secondary";
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

  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error("Erro ao parsear projetos do localStorage:", error);
        setProjects([]);
      }
    }
  }, []);

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Tem certeza que deseja excluir este projeto? Esta ação não poderá ser desfeita.")) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      // Adicionar toast aqui se desejar (ex: useToast().toast({ title: "Projeto excluído!" }))
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
                  <TableCell>{project.startDate ? new Date(project.startDate).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                  <TableCell>{project.endDate ? new Date(project.endDate).toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
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
                        <DropdownMenuItem asChild>
                           <Link href={`/dashboard/projects/edit/${project.id}`} className="flex items-center cursor-pointer"> {/* Idealmente uma página de edição separada ou query param */}
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProject(project.id)} 
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
           {projects.length === 0 && <p className="text-center text-muted-foreground font-body py-8">Nenhum projeto cadastrado.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

    