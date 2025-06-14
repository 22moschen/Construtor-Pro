"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } } from "@/components/ui/card";
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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

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
  totalArea: z.string().optional(), // Using string for input, can convert to number later
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

export default function NewProjectPage() {
  const { control, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      status: "Planejamento",
    }
  });

  const onSubmit = (data: ProjectFormData) => {
    console.log(data);
    // Placeholder for actual submission logic
    alert("Projeto salvo (simulado)!");
    // router.push("/dashboard/projects") or use toast
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
                          {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
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
                          {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
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
             <div className="space-y-2">
                <Label htmlFor="totalArea" className="font-headline">Dimensões Gerais / Área Total (m²)</Label>
                 <Controller
                  name="totalArea"
                  control={control}
                  render={({ field }) => <Input id="totalArea" placeholder="Ex: 150m² ou 10x15m" {...field} />}
                />
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
