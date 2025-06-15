
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Briefcase, CalendarClock, AlertTriangle, ListChecks, DollarSign, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/types"; // Importar o tipo Project atualizado
import { getProjects } from "@/services/projectService"; // Importar serviço
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const getStatusVisuals = (status: string) => {
  switch (status) {
    case "Em Andamento": return { textColor: "text-blue-500", bgColor: "bg-blue-500", badgeClass: "bg-blue-100 text-blue-700" };
    case "Concluído": return { textColor: "text-green-500", bgColor: "bg-green-500", badgeClass: "bg-green-100 text-green-700" };
    case "Planejamento": return { textColor: "text-purple-500", bgColor: "bg-purple-500", badgeClass: "bg-purple-100 text-purple-700" };
    case "Orçamento": return { textColor: "text-yellow-600", bgColor: "bg-yellow-500", badgeClass: "bg-yellow-100 text-yellow-700" };
    case "Aprovado": return { textColor: "text-teal-500", bgColor: "bg-teal-500", badgeClass: "bg-teal-100 text-teal-700" };
    case "Cancelado": return { textColor: "text-red-500", bgColor: "bg-red-500", badgeClass: "bg-red-100 text-red-700" };
    default: return { textColor: "text-gray-500", bgColor: "bg-gray-500", badgeClass: "bg-gray-100 text-gray-700" };
  }
};


export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Mock data para tarefas e alertas, pois não temos um sistema de tarefas ainda
  const upcomingTasks = [
    { id: 1, name: "Reunião com cliente - Projeto Alpha", dueDate: "Amanhã, 10:00", project: "Projeto Alpha" },
    { id: 2, name: "Visita técnica - Obra Beta", dueDate: "Em 2 dias", project: "Obra Beta" },
  ];
  const alerts = [
    { id: 1, message: "Projeto 'Reforma Gamma' está com prazo final em 3 dias.", type: "warning" },
    { id: 2, message: "Tarefa 'Comprar Cimento' para 'Obra Beta' está atrasada.", type: "error" },
  ];

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects.sort((a, b) => {
        // Ordena por data de criação, mais recente primeiro
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }));
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível buscar os projetos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const activeProjectsCount = projects.filter(p => p.status === "Em Andamento" || p.status === "Aprovado" || p.status === "Planejamento" || p.status === "Orçamento").length;
  const approvedBudgetsTotal = projects
    .filter(p => p.status === "Aprovado" && p.budget)
    .reduce((sum, p) => sum + (p.budget || 0), 0);

  const summaryStats = [
    { title: "Projetos Ativos", value: activeProjectsCount.toString(), icon: Briefcase, color: "text-primary" },
    { title: "Tarefas Pendentes", value: "12", icon: ListChecks, color: "text-yellow-500" }, // Mocked
    { title: "Prazos Próximos", value: "3", icon: CalendarClock, color: "text-orange-500" }, // Mocked
    { title: "Orçamentos Aprovados", value: `${approvedBudgetsTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, icon: DollarSign, color: "text-green-500" },
  ];

  const recentProjectsData = projects.slice(0, 3).map(p => { // Pega os 3 mais recentes (já ordenados)
    const visuals = getStatusVisuals(p.status);
    let progress = 10;
    if (p.status === "Concluído") progress = 100;
    else if (p.status === "Em Andamento") progress = 60; // Progresso mockado
    else if (p.status === "Aprovado") progress = 30;
    else if (p.status === "Orçamento") progress = 20;

    return {
      id: p.id,
      name: p.projectName,
      status: p.status,
      progress: progress,
      statusColor: visuals.textColor,
      bgColor: visuals.bgColor,
      badgeClass: visuals.badgeClass,
    };
  });


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 font-body text-lg">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline text-foreground">Dashboard</h1>
        <Link href="/dashboard/projects/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stat.value}</div>
              <p className="text-xs text-muted-foreground font-body">
                {stat.title === "Orçamentos Aprovados" ? "Total aprovado" : ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Próximas Tarefas e Prazos</CardTitle>
            <CardDescription className="font-body">Fique de olho nos seus compromissos (dados de exemplo).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-lg">
                <div>
                  <p className="font-semibold font-body">{task.name}</p>
                  <p className="text-sm text-muted-foreground font-body">Projeto: {task.project}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-primary font-body">{task.dueDate}</span>
                </div>
              </div>
            ))}
             {upcomingTasks.length === 0 && <p className="text-muted-foreground font-body">Nenhuma tarefa próxima.</p>}
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/dashboard/schedule">Ver Todos os Agendamentos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Projetos Recentes</CardTitle>
            <CardDescription className="font-body">Acompanhe o progresso dos seus projetos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjectsData.map((project) => (
              <div key={project.id} className="p-3 bg-card-foreground/5 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <Link href={`/dashboard/projects/${project.id}`} className="font-semibold hover:underline font-body">{project.name}</Link>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${project.badgeClass}`}>
                    {project.status}
                  </span>
                </div>
                <Progress value={project.progress} className="h-2.5 [&>div]:bg-primary" />
                <p className="text-xs text-muted-foreground mt-1 font-body">{project.progress}% concluído</p>
              </div>
            ))}
            {recentProjectsData.length === 0 && <p className="text-muted-foreground font-body">Nenhum projeto recente.</p>}
             <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/dashboard/projects">Ver Todos os Projetos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-yellow-50 border-yellow-300 shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 space-y-0">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <CardTitle className="font-headline text-yellow-700 text-xl">Alertas Importantes (Exemplo)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside text-yellow-700 font-body">
            {alerts.map(alert => (
                 <li key={alert.id} className={alert.type === "error" ? "font-semibold" : ""}>{alert.message}</li>
            ))}
          </ul>
           {alerts.length === 0 && <p className="text-yellow-600 font-body mt-2">Nenhum alerta no momento.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
