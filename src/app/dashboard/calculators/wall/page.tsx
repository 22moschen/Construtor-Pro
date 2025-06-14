"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { BrickIcon } from "@/components/icons/brick-icon";
import { AlertCircle, Calculator, ChevronsRight, ShoppingCart, TrendingUp } from "lucide-react";
import React, { useState } from "react";

// Mock data for brick types - in a real app, this would come from materials DB
const brickTypes = [
  { id: "1", name: "Tijolo Cerâmico 8 Furos (19x19x9cm)", length: 0.19, height: 0.19, thickness: 0.09 },
  { id: "2", name: "Tijolo Ecológico (25x12.5x6.5cm)", length: 0.25, height: 0.125, thickness: 0.065 },
  { id: "3", name: "Bloco de Concreto (39x19x14cm)", length: 0.39, height: 0.19, thickness: 0.14 },
];

export default function WallCalculatorPage() {
  const [showColumns, setShowColumns] = useState(false);
  const [showBaldrame, setShowBaldrame] = useState(false);
  const [showCinta, setShowCinta] = useState(false);
  const [selectedBrick, setSelectedBrick] = useState<typeof brickTypes[0] | null>(null);
  const [manualBrick, setManualBrick] = useState({ length: "", height: "", thickness: "" });

  // Placeholder for calculation results
  const [results, setResults] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder calculation logic
    setResults({
      bricks: 1250,
      mortarVolume: 0.75,
      concreteColumnsVolume: showColumns ? 0.35 : 0,
      concreteBaldrameVolume: showBaldrame ? 0.50 : 0,
      concreteCintaVolume: showCinta ? 0.40 : 0,
      cementBags: 35,
      sandVolume: 1.5,
      gravelVolume: 2.2,
      steelEstimate: 85, // kg
      laborCost: 2500,
      totalMaterialCost: 4800,
      totalCost: 7300,
      profitMargin: 20,
      sellingPrice: 8760,
      daysEstimate: 5,
      profitPerDay: (8760 - 7300) / 5,
    });
  };
  
  const handleBrickTypeChange = (value: string) => {
    if (value === "manual") {
      setSelectedBrick(null);
    } else {
      const brick = brickTypes.find(b => b.id === value);
      setSelectedBrick(brick || null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <BrickIcon className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-headline text-foreground">Calculadora de Materiais para Muro</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Inputs Column */}
        <Card className="lg:col-span-2 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Parâmetros do Muro</CardTitle>
            <CardDescription className="font-body">Informe as dimensões e características do muro para estimar os materiais.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="wallLength" className="font-headline">Comprimento Total do Muro (m)</Label>
                  <Input id="wallLength" type="number" step="0.01" placeholder="Ex: 25" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wallHeight" className="font-headline">Altura do Muro (m)</Label>
                  <Input id="wallHeight" type="number" step="0.01" placeholder="Ex: 2.5" required />
                </div>
              </div>

              <Separator />
              <h3 className="text-lg font-headline">Tijolos e Argamassa</h3>
              <div className="space-y-2">
                <Label htmlFor="brickType" className="font-headline">Tipo de Tijolo</Label>
                <Select onValueChange={handleBrickTypeChange}>
                  <SelectTrigger id="brickType">
                    <SelectValue placeholder="Selecione o tipo de tijolo" />
                  </SelectTrigger>
                  <SelectContent>
                    {brickTypes.map(brick => (
                      <SelectItem key={brick.id} value={brick.id}>{brick.name}</SelectItem>
                    ))}
                    <SelectItem value="manual">Informar Dimensões Manualmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedBrick === null && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/20">
                    <div className="space-y-1">
                        <Label htmlFor="manualBrickLength" className="text-sm">Comprimento (m)</Label>
                        <Input id="manualBrickLength" type="number" step="0.001" placeholder="0.19" value={manualBrick.length} onChange={e => setManualBrick({...manualBrick, length: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="manualBrickHeight" className="text-sm">Altura (m)</Label>
                        <Input id="manualBrickHeight" type="number" step="0.001" placeholder="0.19" value={manualBrick.height} onChange={e => setManualBrick({...manualBrick, height: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="manualBrickThickness" className="text-sm">Espessura (m)</Label>
                        <Input id="manualBrickThickness" type="number" step="0.001" placeholder="0.09" value={manualBrick.thickness} onChange={e => setManualBrick({...manualBrick, thickness: e.target.value})} />
                    </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mortarJointThickness" className="font-headline">Espessura da Junta de Argamassa (m)</Label>
                  <Input id="mortarJointThickness" type="number" step="0.001" placeholder="Ex: 0.01" defaultValue="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mortarMixRatio" className="font-headline">Traço da Argamassa (Cimento:Areia)</Label>
                  <Input id="mortarMixRatio" type="text" placeholder="Ex: 1:4" defaultValue="1:4" required />
                </div>
              </div>

              <Separator />
              <h3 className="text-lg font-headline">Estrutura de Concreto</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="hasColumns" checked={showColumns} onCheckedChange={setShowColumns} />
                  <Label htmlFor="hasColumns" className="font-headline">Haverá Colunas de Concreto?</Label>
                </div>
                {showColumns && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/20">
                    <Input type="number" step="0.01" placeholder="Distância entre colunas (m)" />
                    <Input type="text" placeholder="Dimensões da seção (LxE m) ex: 0.15x0.15" />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch id="hasBaldrame" checked={showBaldrame} onCheckedChange={setShowBaldrame} />
                  <Label htmlFor="hasBaldrame" className="font-headline">Haverá Viga Baldrame?</Label>
                </div>
                {showBaldrame && (
                  <div className="p-4 border rounded-md bg-muted/20">
                    <Input type="text" placeholder="Dimensões da seção (LxA m) ex: 0.15x0.20" />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch id="hasCinta" checked={showCinta} onCheckedChange={setShowCinta} />
                  <Label htmlFor="hasCinta" className="font-headline">Haverá Cinta de Amarração?</Label>
                </div>
                {showCinta && (
                  <div className="p-4 border rounded-md bg-muted/20">
                    <Input type="text" placeholder="Dimensões da seção (LxA m) ex: 0.15x0.20" />
                  </div>
                )}
                {(showColumns || showBaldrame || showCinta) && (
                     <div className="space-y-2">
                        <Label htmlFor="concreteMixRatio" className="font-headline">Traço do Concreto (Cimento:Areia:Brita)</Label>
                        <Input id="concreteMixRatio" type="text" placeholder="Ex: 1:2:3" defaultValue="1:2:3" />
                    </div>
                )}
              </div>
              
              <Separator />
              <h3 className="text-lg font-headline">Percentuais de Perda</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="brickLoss" className="text-sm">Tijolos (%)</Label>
                        <Input id="brickLoss" type="number" step="0.1" placeholder="10" defaultValue="10" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="cementLoss" className="text-sm">Cimento (%)</Label>
                        <Input id="cementLoss" type="number" step="0.1" placeholder="5" defaultValue="5" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="aggregateLoss" className="text-sm">Agregados (%)</Label>
                        <Input id="aggregateLoss" type="number" step="0.1" placeholder="7" defaultValue="7" />
                    </div>
                </div>

              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Calculator className="mr-2 h-5 w-5" /> Calcular Materiais
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results and Actions Column */}
        <div className="space-y-6">
          <Card className="shadow-xl sticky top-24"> {/* Sticky for long forms */}
            <CardHeader>
              <CardTitle className="font-headline text-xl">Resultados Estimados</CardTitle>
              <CardDescription className="font-body">Quantidades de materiais e custos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!results && (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                  <AlertCircle className="h-12 w-12 mb-3" />
                  <p className="font-body">Preencha os parâmetros do muro e clique em "Calcular Materiais" para ver os resultados.</p>
                </div>
              )}
              {results && (
                <>
                  <h4 className="font-headline text-md">Materiais Principais:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm font-body text-foreground">
                    <li>Tijolos: {results.bricks} unidades</li>
                    <li>Argamassa de Assentamento: {results.mortarVolume} m³</li>
                    {showColumns && <li>Concreto para Colunas: {results.concreteColumnsVolume} m³</li>}
                    {showBaldrame && <li>Concreto para Viga Baldrame: {results.concreteBaldrameVolume} m³</li>}
                    {showCinta && <li>Concreto para Cinta de Amarração: {results.concreteCintaVolume} m³</li>}
                  </ul>
                  <Separator/>
                  <h4 className="font-headline text-md pt-2">Componentes (Estimativa):</h4>
                   <ul className="list-disc list-inside space-y-1 text-sm font-body text-foreground">
                    <li>Cimento: {results.cementBags} sacos</li>
                    <li>Areia: {results.sandVolume} m³</li>
                    <li>Brita: {results.gravelVolume} m³</li>
                    {(showColumns || showBaldrame || showCinta) && <li>Aço: {results.steelEstimate} kg</li>}
                  </ul>
                  <Button variant="outline" className="w-full mt-4">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar ao Orçamento do Projeto
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {results && (
            <Card className="shadow-xl">
                 <CardHeader>
                    <CardTitle className="font-headline text-xl">Análise de Custo e Lucratividade</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="laborCostType" className="font-headline">Custo de Mão de Obra</Label>
                        <Select defaultValue="perLinearMeter">
                            <SelectTrigger id="laborCostType">
                                <SelectValue placeholder="Tipo de custo de mão de obra" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="perLinearMeter">Por metro linear (R$/m)</SelectItem>
                                <SelectItem value="perSquareMeter">Por metro quadrado (R$/m²)</SelectItem>
                                <SelectItem value="teamDailyRate">Produtividade e diária da equipe</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Add inputs based on selection above */}
                    <Input type="number" placeholder="Valor do custo de M.O." className="mt-2"/>
                    
                    <Separator />
                    <div className="font-body text-sm space-y-1">
                        <p>Custo Total de Material Estimado: <span className="font-semibold">R$ {results.totalMaterialCost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></p>
                        <p>Custo de Mão de Obra Estimado: <span className="font-semibold">R$ {results.laborCost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></p>
                        <p className="font-bold">Custo Total (Material + M.O.): <span className="font-semibold">R$ {results.totalCost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></p>
                    </div>
                     <Separator />
                     <div className="space-y-2">
                        <Label htmlFor="profitMargin" className="font-headline">Margem de Lucro Desejada (%)</Label>
                        <Input id="profitMargin" type="number" placeholder="Ex: 20" defaultValue={results.profitMargin} />
                     </div>
                     <div className="font-body text-sm space-y-1 pt-2">
                        <p className="text-lg font-bold text-primary">Preço de Venda Sugerido: <span className="font-semibold">R$ {results.sellingPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></p>
                        <p>Lucro Estimado: <span className="font-semibold text-green-600">R$ {(results.sellingPrice - results.totalCost).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></p>
                        <p>Diárias Estimadas: {results.daysEstimate} dias</p>
                        <p>Lucro por Diária Estimado: <span className="font-semibold">R$ {results.profitPerDay.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></p>
                     </div>
                 </CardContent>
                 <CardFooter>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <TrendingUp className="mr-2 h-4 w-4" /> Finalizar e Gerar Proposta
                    </Button>
                 </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
