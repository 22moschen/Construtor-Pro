import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

// Mock data - replace with actual data fetching
const projects = [
  { id: "1", name: "Construção Residencial Alpha", client: "João Silva", status: "Em Andamento", startDate: "01/03/2024", endDate: "30/09/2024", budget: 120000 },
  { id: "2", name: "Reforma Comercial Beta", client: "Maria Oliveira", status: "Concluído", startDate: "15/01/2024", endDate: "15/04/2024", budget: 75000 },
  { id: "3", name: "Planejamento Edifício Gamma", client: "Construtora XYZ", status: "Planejamento", startDate: "10/05/2024", endDate: "10/12/2024", budget: 500000 },
  { id: "4", name: "Pintura Externa Delta", client: "Ana Costa", status: "Orçamento", startDate: "20/07/2024", endDate: "30/07/2024", budget: 15000 },
  { id: "5", name: "Instalação Hidráulica Epsilon", client: "Pedro Santos", status: "Aprovado", startDate: "01/08/2024", endDate: "15/08/2024", budget: 25000 },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Em Andamento": return "default";
    case "Concluído": return "secondary"; // Will use CSS for green-like color
    case "Planejamento": return "outline"; // Will use CSS for purple-like color
    case "Orçamento": return "outline";
    case "Aprovado": return "default"; // Will use CSS for another color
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
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(project.status) as any} className={getStatusBadgeClass(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.startDate}</TableCell>
                  <TableCell>{project.endDate}</TableCell>
                  <TableCell className="text-right">{project.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
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
                          <Link href={`/dashboard/projects/${project.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" /> Detalhes / Orçamento
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href={`/dashboard/projects/${project.id}?edit=true`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
