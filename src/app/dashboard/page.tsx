import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CalendarClock, AlertTriangle, CheckCircle2, ListChecks, DollarSign, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const summaryStats = [
    { title: "Projetos Ativos", value: "5", icon: Briefcase, color: "text-primary" },
    { title: "Tarefas Pendentes", value: "12", icon: ListChecks, color: "text-yellow-500" },
    { title: "Prazos Próximos", value: "3", icon: CalendarClock, color: "text-orange-500" },
    { title: "Orçamentos Aprovados", value: "R$ 150.000", icon: DollarSign, color: "text-green-500" },
  ];

  const upcomingTasks = [
    { id: 1, name: "Reunião com cliente - Projeto Alpha", dueDate: "Amanhã, 10:00", project: "Projeto Alpha" },
    { id: 2, name: "Visita técnica - Obra Beta", dueDate: "25/07/2024", project: "Obra Beta" },
    { id: 3, name: "Finalizar orçamento - Reforma Gamma", dueDate: "26/07/2024", project: "Reforma Gamma" },
  ];

  const recentProjects = [
    { id: 1, name: "Construção Residencial Alpha", status: "Em Andamento", progress: 60, statusColor: "text-blue-500", bgColor: "bg-blue-500" },
    { id: 2, name: "Reforma Comercial Beta", status: "Concluído", progress: 100, statusColor: "text-green-500", bgColor: "bg-green-500" },
    { id: 3, name: "Planejamento Edifício Gamma", status: "Planejamento", progress: 15, statusColor: "text-purple-500", bgColor: "bg-purple-500" },
  ];

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

      {/* Summary Stats */}
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
                {stat.title === "Orçamentos Aprovados" ? "Nos últimos 30 dias" : ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Tasks / Deadlines */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Próximas Tarefas e Prazos</CardTitle>
            <CardDescription className="font-body">Fique de olho nos seus compromissos.</CardDescription>
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
            <Button variant="outline" className="w-full mt-2">
              <Link href="/dashboard/schedule">Ver Todos os Agendamentos</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Projects Overview */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Projetos Recentes</CardTitle>
            <CardDescription className="font-body">Acompanhe o progresso dos seus projetos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="p-3 bg-card-foreground/5 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <Link href={`/dashboard/projects/${project.id}`} className="font-semibold hover:underline font-body">{project.name}</Link>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${project.statusColor} bg-opacity-10 ${project.bgColor} bg-opacity-20`}>
                    {project.status}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className={`${project.bgColor} h-2.5 rounded-full`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-body">{project.progress}% concluído</p>
              </div>
            ))}
            {recentProjects.length === 0 && <p className="text-muted-foreground font-body">Nenhum projeto recente.</p>}
             <Button variant="outline" className="w-full mt-2">
              <Link href="/dashboard/projects">Ver Todos os Projetos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section - Example */}
      <Card className="bg-yellow-50 border-yellow-300 shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 space-y-0">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <CardTitle className="font-headline text-yellow-700 text-xl">Alertas Importantes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside text-yellow-700 font-body">
            <li>Projeto "Reforma Gamma" está com prazo final em 3 dias.</li>
            <li>Tarefa "Comprar Cimento" para "Obra Beta" está atrasada.</li>
          </ul>
           {/* <p className="text-yellow-600 font-body mt-2">Nenhum alerta no momento.</p> */}
        </CardContent>
      </Card>
    </div>
  );
}
