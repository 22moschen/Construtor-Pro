// src/app/dashboard/projects/edit/[id]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation"; // useParams para pegar o ID
import React, { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import type { Project } from "@/types";
import { getProjectById, updateProject } from "@/services/projectService";
import { useToast } from "@/hooks/use-toast";

const projectStatusOptions = [
  "Planejamento", "Orçamento", "Aprovado", "Em Andamento", "Concluído", "Cancelado"
];

const projectFormSchema = z.object({
  projectName: z.string().min(3, "Nome do projeto deve ter no mínimo 3 caracteres."),
  clientName: z.string().min(2, "Nome do cliente é obrigatório."),
  clientContact: z.string().optional(),
  workAddress: z.string().min(5, "Endereço da obra é obrigatório."),
  description: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.string().min(1, "Status é obrigatório."),
  totalArea: z.string().optional(),
  budget: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(String(val).replace(/\D/g, '')) / 100),
    z.number().positive("Orçamento deve ser um valor positivo.").optional()
  ),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      status: "Planejamento",
    }
  });

  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const project = await getProjectById(projectId);
      if (project) {
        reset({
          ...project,
          startDate: project.startDate ? new Date(project.startDate) : undefined,
          endDate: project.endDate ? new Date(project.endDate) : undefined,
        });
      } else {
        toast({ title: "Projeto não encontrado", variant: "destructive" });
        router.push("/dashboard/projects");
      }
    } catch (error) {
      console.error("Erro ao carregar projeto para edição:", error);
      toast({ title: "Erro ao carregar projeto", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, reset, router, toast]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const onSubmit = async (data: ProjectFormData) => {
    if (!projectId) return;
    try {
      const projectDataToUpdate: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'budgetItems' | 'bdiPercentage'>> = {
        ...data,
        startDate: data.startDate?.toISOString(),
        endDate: data.endDate?.toISOString(),
      };
      
      await updateProject(projectId, projectDataToUpdate);
      toast({
        title: "Projeto Atualizado!",
        description: `O projeto "${data.projectName}" foi atualizado com sucesso.`,
      });
      router.push(`/dashboard/projects/${projectId}`); // Volta para a página de detalhes
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o projeto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const budgetValue = watch("budget");
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return "";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 font-body text-lg">Carregando dados do projeto...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
       <Link href={`/dashboard/projects/${projectId}`} className="flex items-center text-sm text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Detalhes do Projeto
      </Link>
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Editar Projeto</CardTitle>
          <CardDescription className="font-body">Modifique os detalhes do projeto abaixo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="font-headline">Nome do Projeto</Label>
                <Controller
                  name="projectName"
                  control={control}
                  render={({ field }) => <Input id="projectName" placeholder="Ex: Residência Unifamiliar" {...field} />}
                />
                {errors.projectName && <p className="text-sm text-destructive">{errors.projectName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="font-headline">Status</Label>
                 <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStatusOptions.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="font-headline">Nome do Cliente</Label>
                <Controller
                  name="clientName"
                  control={control}
                  render={({ field }) => <Input id="clientName" placeholder="Ex: João da Silva" {...field} />}
                />
                {errors.clientName && <p className="text-sm text-destructive">{errors.clientName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientContact" className="font-headline">Contato do Cliente</Label>
                <Controller
                  name="clientContact"
                  control={control}
                  render={({ field }) => <Input id="clientContact" placeholder="Telefone ou Email" {...field} />}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workAddress" className="font-headline">Endereço da Obra</Label>
              <Controller
                name="workAddress"
                control={control}
                render={({ field }) => <Input id="workAddress" placeholder="Rua, Número, Bairro, Cidade - UF" {...field} />}
              />
              {errors.workAddress && <p className="text-sm text-destructive">{errors.workAddress.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-headline">Descrição do Projeto</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea id="description" placeholder="Detalhes sobre o projeto, escopo, etc." className="min-h-[100px]" {...field} />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="font-headline">Data de Início Prevista</Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(field.value), "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="font-headline">Data de Fim Prevista</Label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                     <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(field.value), "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="totalArea" className="font-headline">Dimensões Gerais / Área Total (m²)</Label>
                    <Controller
                    name="totalArea"
                    control={control}
                    render={({ field }) => <Input id="totalArea" placeholder="Ex: 150m² ou 10x15m" {...field} />}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="budget" className="font-headline">Orçamento Inicial (R$)</Label>
                    <Input
                      id="budget"
                      placeholder="Ex: R$ 10.000,00"
                      type="text" 
                      value={budgetValue !== undefined ? formatCurrency(budgetValue) : ""}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        const numericValue = parseFloat(rawValue.replace(/\D/g, '')) / 100;
                        setValue("budget", isNaN(numericValue) ? undefined : numericValue, { shouldValidate: true });
                      }}
                    />
                    {errors.budget && <p className="text-sm text-destructive">{errors.budget.message}</p>}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Link href={`/dashboard/projects/${projectId}`}>
                <Button variant="outline" type="button" disabled={isSubmitting}>Cancelar</Button>
              </Link>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Criar a pasta e o arquivo se não existir
// mkdir -p src/app/dashboard/projects/edit/[id]
// touch src/app/dashboard/projects/edit/[id]/page.tsx
