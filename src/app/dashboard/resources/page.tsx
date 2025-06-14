import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const materials = [
  { id: "1", name: "Tijolo Cerâmico 8 Furos", unit: "Unidade", price: 0.80, supplier: "Cerâmica Boa Vista", code: "TJ001" },
  { id: "2", name: "Cimento CPII Saco 50kg", unit: "Saco", price: 28.50, supplier: "Cimentos Forte", code: "CM002" },
  { id: "3", name: "Areia Média Lavada", unit: "m³", price: 120.00, supplier: "Areial Pedreira", code: "AR001" },
  { id: "4", name: "Brita 1", unit: "m³", price: 150.00, supplier: "Areial Pedreira", code: "BR001" },
];

const services = [
  { id: "1", name: "Assentamento de Alvenaria", unit: "m²", price: 25.00 },
  { id: "2", name: "Instalação Elétrica Ponto", unit: "Ponto", price: 70.00 },
  { id: "3", name: "Pintura Látex (2 demãos)", unit: "m²", price: 18.00 },
  { id: "4", name: "Escavação Manual", unit: "m³", price: 90.00 },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-headline text-foreground">Cadastro Base de Recursos</h1>
        {/* Button could change based on active tab, or have two buttons */}
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="materials" className="font-headline">Materiais</TabsTrigger>
            <TabsTrigger value="services" className="font-headline">Serviços (Mão de Obra)</TabsTrigger>
          </TabsList>
          {/* Example: A single Add button that adapts, or two specific buttons */}
           <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Novo
            </Button>
        </div>
        
        <TabsContent value="materials">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline">Lista de Materiais</CardTitle>
              <CardDescription className="font-body">Gerencie os materiais utilizados em seus projetos.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-headline">Nome do Material</TableHead>
                    <TableHead className="font-headline">Unidade</TableHead>
                    <TableHead className="font-headline text-right">Preço Unit. (R$)</TableHead>
                    <TableHead className="font-headline">Fornecedor</TableHead>
                    <TableHead className="font-headline">Código</TableHead>
                    <TableHead className="font-headline text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow key={material.id} className="font-body hover:bg-muted/50">
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell className="text-right">{material.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{material.supplier || "N/A"}</TableCell>
                      <TableCell>{material.code || "N/A"}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
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
              {materials.length === 0 && <p className="text-center text-muted-foreground font-body py-8">Nenhum material cadastrado.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline">Lista de Serviços (Mão de Obra)</CardTitle>
              <CardDescription className="font-body">Gerencie os serviços e custos de mão de obra.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-headline">Nome do Serviço</TableHead>
                    <TableHead className="font-headline">Unidade de Cobrança</TableHead>
                    <TableHead className="font-headline text-right">Preço Unit. (R$)</TableHead>
                    <TableHead className="font-headline text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id} className="font-body hover:bg-muted/50">
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.unit}</TableCell>
                      <TableCell className="text-right">{service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-center">
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
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
              {services.length === 0 && <p className="text-center text-muted-foreground font-body py-8">Nenhum serviço cadastrado.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
