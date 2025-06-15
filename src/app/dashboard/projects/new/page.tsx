
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
import { CalendarIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

const projectStatusOptions = [
  "Planejamento", "Orçamento", "Aprovado", "Em Andamento", "Concluído", "Cancelado"
];

// Definindo um tipo para o projeto que será salvo e usado em outras partes
export interface BudgetItem {
  id: string;
  type: "Material" | "Serviço";
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Project {
  id: string;
  projectName: string;
  clientName: string;
  clientContact?: string;
  workAddress: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status: string;
  totalArea?: string;
  budget?: number; // Orçamento inicial
  budgetItems?: BudgetItem[];
  bdiPercentage?: number;
}


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
  budget: z.preprocess( // Orçamento inicial
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(String(val).replace(/\D/g, '')) / 100), // Converte para número, removendo não dígitos e dividindo por 100
    z.number().positive("Orçamento deve ser um valor positivo.").optional()
  ),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }, register, watch, setValue } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      status: "Planejamento",
      projectName: "",
      clientName: "",
      clientContact: "",
      workAddress: "",
      description: "",
      totalArea: "",
      budget: undefined,
    }
  });

  const onSubmit = (data: ProjectFormData) => {
    try {
      const existingProjectsString = localStorage.getItem("projects");
      const existingProjects: Project[] = existingProjectsString ? JSON.parse(existingProjectsString) : [];

      const newProject: Project = {
        ...data,
        id: Date.now().toString(),
        budgetItems: [], // Inicializa budgetItems como array vazio
        bdiPercentage: 25, // BDI padrão
      };

      existingProjects.push(newProject);
      localStorage.setItem("projects", JSON.stringify(existingProjects));
      
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      // Aqui você pode usar o useToast para mostrar um erro
      // Ex: toast({ title: "Erro ao salvar", description: "Não foi possível salvar o projeto.", variant: "destructive" });
    }
  };
  
  const budgetValue = watch("budget");

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return "";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };


  return (
    <div className="space-y-8">
       <Link href="/dashboard/projects" className="flex items-center text-sm text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Projetos
      </Link>
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Novo Projeto de Construção</CardTitle>
          <CardDescription className="font-body">Preencha os detalhes abaixo para criar um novo projeto.</CardDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      type="text" // Usar text para permitir formatação
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
              <Link href="/dashboard/projects">
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Salvar Projeto</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

    