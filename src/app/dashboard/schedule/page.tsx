"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import React, { useState } from "react";

// Mock data
const tasks = [
  { id: "1", description: "Reunião de alinhamento - Projeto Alpha", project: "Projeto Alpha", startDate: new Date(2024, 6, 25, 10, 0), endDate: new Date(2024, 6, 25, 11, 0), status: "Pendente" },
  { id: "2", description: "Compra de materiais - Obra Beta", project: "Obra Beta", startDate: new Date(2024, 6, 26), endDate: new Date(2024, 6, 26), status: "Em Andamento" },
  { id: "3", description: "Entrega da Fase 1 - Construção Gamma", project: "Construção Gamma", startDate: new Date(2024, 7, 5), endDate: new Date(2024, 7, 5), status: "Concluída" },
  { id: "4", description: "Visita técnica ao fornecedor", project: "Geral", startDate: new Date(2024, 6, 22), endDate: new Date(2024, 6, 22), status: "Atrasada" },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Pendente": return "outline";
    case "Em Andamento": return "default";
    case "Concluída": return "secondary";
    case "Atrasada": return "destructive";
    default: return "secondary";
  }
};
const getStatusIcon = (status: string) => {
  switch (status) {
    case "Pendente": return <Clock className="h-4 w-4 text-yellow-500" />;
    case "Em Andamento": return <Clock className="h-4 w-4 text-blue-500" />;
    case "Concluída": return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Atrasada": return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const tasksForSelectedDate = date 
    ? tasks.filter(task => 
        new Date(task.startDate).toDateString() === date.toDateString() ||
        (task.endDate && new Date(task.endDate).toDateString() === date.toDateString()) ||
        (task.startDate < date && task.endDate && task.endDate > date) // For multi-day tasks spanning selected date
      )
    : tasks;


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-headline text-foreground">Agenda de Serviços e Tarefas</h1>
        <Button className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Nova Tarefa/Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <Card className="md:col-span-1 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline">Calendário</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border p-0"
              locale={require("date-fns/locale/pt-BR").ptBR}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline">
              Tarefas para {date ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : "Todas as Tarefas"}
            </CardTitle>
            <CardDescription className="font-body">Visualize suas tarefas e agendamentos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasksForSelectedDate.length > 0 ? tasksForSelectedDate.map((task) => (
              <div key={task.id} className="flex items-start justify-between p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
                <div className="flex items-start space-x-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <p className="font-semibold font-body">{task.description}</p>
                    <p className="text-sm text-muted-foreground font-body">Projeto: {task.project}</p>
                    <p className="text-xs text-muted-foreground font-body">
                      {new Date(task.startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      {task.endDate && ` - ${new Date(task.endDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                 <Badge variant={getStatusBadgeVariant(task.status) as any} className="mb-2 whitespace-nowrap">{task.status}</Badge>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-muted-foreground font-body py-8">
                Nenhuma tarefa para {date ? `o dia ${date.toLocaleDateString('pt-BR')}` : "esta data"}.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

       {/* Alerts Section - Example for this page */}
      <Card className="bg-orange-50 border-orange-300 shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 space-y-0">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <CardTitle className="font-headline text-orange-700 text-xl">Alertas de Prazos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside text-orange-700 font-body">
            <li>Tarefa "Finalizar fundação - Projeto Alpha" vence em 2 dias.</li>
            <li>Projeto "Reforma Comercial Beta" está com 5 dias de atraso na entrega da documentação.</li>
          </ul>
           {/* <p className="text-orange-600 font-body mt-2">Nenhum alerta de prazo no momento.</p> */}
        </CardContent>
      </Card>
    </div>
  );
}
