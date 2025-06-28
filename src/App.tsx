import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Slider } from './components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { ChevronRight, Play, Download, Eye, ShoppingCart, Settings, CreditCard, Mail, Package, RotateCcw, Info, Sparkles, Zap, Star, Heart, Diamond, Palette, Ruler, Weight, Shield } from 'lucide-react'
import WebgiViewer from './WebgiViewer'
import './App.css'

const productConfigurator = {
  name: "Žiedas su akmeniu",
  basePrice: 450,
  image: "/src/assets/screenshots/joaze_lt_2025-06-17_19-34-22_6571.webp",
  parameters: [
    {
      id: "metal",
      name: "Metalas",
      icon: <Palette className="w-5 h-5" />,
      description: "Pasirinkite metalo tipą ir spalvą. Skirtingi metalai turi skirtingas savybes ir kainas.",
      detailedInfo: "Metalas yra pagrindinis žiedo komponentas, lemiantis jo išvaizdą, tvarumą ir kainą. Aukso spalva priklauso nuo lydinio sudėties - baltas auksas maišomas su paladžiu ar platina, rožinis - su variu.",
      options: [
        { value: "silver", label: "Sidabras 925", priceModifier: 0, description: "Klasikinis pasirinkimas, tinkamas kasdieniam nešiojimui" },
        { value: "gold-yellow", label: "Geltonas auksas", priceModifier: 200, description: "Tradicinis ir prestižinis pasirinkimas" },
        { value: "gold-white", label: "Baltas auksas", priceModifier: 220, description: "Modernus ir elegantiškas" },
        { value: "gold-rose", label: "Rožinis auksas", priceModifier: 210, description: "Romantiškas ir šiuolaikiškas" }
      ],
      currentValue: "silver"
    },
    {
      id: "purity",
      name: "Praba",
      icon: <Shield className="w-5 h-5" />,
      description: "Metalo grynumas. Aukštesnė praba reiškia didesnį grynojo metalo kiekį.",
      detailedInfo: "Praba nurodo grynojo metalo kiekį lydinyje. 585 praba reiškia 58.5% grynojo aukso, 750 praba - 75%. Aukštesnė praba yra brangesnė, bet ir minkštesnė.",
      options: [
        { value: "585", label: "585 praba", priceModifier: 0, description: "Standartinė praba, tvirta ir patikima" },
        { value: "750", label: "750 praba", priceModifier: 150, description: "Aukštesnė kokybė, intensyvesnė spalva" }
      ],
      currentValue: "585"
    },
    {
      id: "stones",
      name: "Žiedo akmenys",
      icon: <Diamond className="w-5 h-5" />,
      description: "Akmenų skaičius žiede. Daugiau akmenų padidina žiedo blizgesį ir kainą.",
      detailedInfo: "Akmenų skaičius keičia žiedo išvaizdą ir kainą. Kiekvienas papildomas akmuo yra kruopščiai parinktas ir įtvirtintas, užtikrinant maksimalų blizgesį ir saugumą.",
      min: 1,
      max: 7,
      currentValue: 3,
      pricePerStone: 45
    },
    {
      id: "size",
      name: "Dydis",
      icon: <Ruler className="w-5 h-5" />,
      description: "Žiedo dydis (skersmuo). Svarbu tiksliai išmatuoti pirštą optimaliam tinkamumui.",
      detailedInfo: "Žiedo dydis matuojamas pagal vidinio skersmens milimetrus. Rekomenduojame išmatuoti pirštą vakare, kai jis šiek tiek patinęs. Galime pasiūlyti nemokamą dydžio nustatymą mūsų salone.",
      min: 15,
      max: 22,
      currentValue: 18,
      priceModifier: 0
    },
    {
      id: "comfort",
      name: "Komfortas",
      icon: <Heart className="w-5 h-5" />,
      description: "Žiedo vidaus formos tipas, paveiks nešiojimo komfortą.",
      detailedInfo: "Komforto profilis keičia žiedo vidaus formą. Comfort fit profilis turi šiek tiek išgaubtą vidinį paviršių, kuris geriau prisitaiko prie piršto formos ir yra patogesnė nešioti.",
      options: [
        { value: "standard", label: "Standartinis", priceModifier: 0, description: "Klasikinis plokščias profilis" },
        { value: "comfort", label: "Comfort Fit", priceModifier: 25, description: "Ergonomiškas profilis patogesniam nešiojimui" }
      ],
      currentValue: "standard"
    }
  ]
}

const learningSteps = [
  {
    id: 1,
    title: "Registracija / Prisijungimas",
    description: "Sužinokite, kaip užsiregistruoti arba prisijungti prie JOAZE.LT platformos",
    icon: <Eye className="w-6 h-6" />,
    videoUrl: "https://www.youtube.com/embed/XLNh87thSGI",
    content: `Šiame skyriuje sužinosite, kaip užsiregistruoti arba prisijungti prie JOAZE.LT platformos. Sukūrus paskyrą, galėsite stebėti savo užsakymus, peržiūrėti pirkinių istoriją ir mėgautis kitais privalumais.`
  },
  {
    id: 2,
    title: "Perėjimas į parduotuvę",
    description: "Išmokite naršyti JOAZE.LT gaminių asortimentą",
    icon: <ShoppingCart className="w-6 h-6" />,
    videoUrl: "https://www.youtube.com/embed/UilOYdYVqxE",
    content: `Norėdami pradėti naršyti JOAZE.LT gaminių asortimentą, turite pereiti į parduotuvę. Tai galite padaryti keliais būdais.`
  },
  {
    id: 3,
    title: "Konfigūracija – pasirinkimų aiškinimas",
    description: "Sužinokite, kaip naudotis interaktyviu konfigūratoriumi",
    icon: <Settings className="w-6 h-6" />,
    videoUrl: "https://www.youtube.com/embed/moiandWE8A4",
    content: `JOAZE.LT platformoje galite konfigūruoti juvelyrinius dirbinius pagal savo individualius poreikius, naudodamiesi interaktyviu konfigūratoriumi.`
  },
  {
    id: 4,
    title: "Kaina keičiasi realiu laiku",
    description: "Stebėkite, kaip Jūsų pasirinkimai konfigūratoriuje tiesiogiai veikia produkto kainą.",
    icon: <Zap className="w-6 h-6" />,
    videoUrl: "https://www.youtube.com/embed/juEOCWn9pto",
    content: `Vienas iš patogiausių JOAZE.LT konfigūratoriaus aspektų yra realaus laiko kainos atnaujinimas. Keisdami metalo tipą, prabą, akmenų skaičių ar dydį, iškart matysite, kaip keičiasi galutinė produkto kaina. Tai padeda priimti informuotus sprendimus ir išlaikyti biudžetą.`
  },
  {
    id: 5,
    title: "Įdėjimas į krepšelį ir peržiūra",
    description: "Sužinokite, kaip pridėti sukonfigūruotą prekę į krepšelį ir peržiūrėti užsakymą.",
    icon: <ShoppingCart className="w-6 h-6" />,
    videoUrl: "https://www.youtube.com/embed/sRjATADPdaE",
    content: `Kai esate patenkinti savo sukonfigūruotu produktu, spauskite mygtuką 'Įdėti į krepšelį'. Produktas bus pridėtas į Jūsų pirkinių krepšelį. Galite tęsti apsipirkimą arba pereiti į krepšelį, kad peržiūrėtumėte savo užsakymą. Krepšelyje galėsite koreguoti kiekius arba pašalinti prekes.`
  },
  {
    id: 6,
    title: "Atsiskaitymas",
    description: "Detalus vadovas, kaip atlikti mokėjimą ir užbaigti užsakymą.",
    icon: <CreditCard className="w-6 h-6" />,
    videoUrl: "https://www.youtube.com/embed/eoByDGrR_Pw",
    content: `Kai esate pasiruošę užbaigti užsakymą, pereikite į atsiskaitymo puslapį. Čia turėsite pasirinkti pristatymo būdą, įvesti pristatymo adresą ir pasirinkti mokėjimo metodą. JOAZE.LT palaiko įvairius mokėjimo būdus, įskaitant banko pavedimus ir elektroninius mokėjimus. Patvirtinkite užsakymą ir atlikite mokėjimą.`
  },
  {
    id: 7,
    title: "Patvirtinimas el. paštu",
    description: "Ką daryti po užsakymo? Gaukite patvirtinimą ir sekite savo užsakymo eigą.",
    icon: <Mail className="w-6 h-6" />,
    videoUrl: "https://www.youtube.com/embed/sSjN0ChIHqU",
    content: `Po sėkmingo atsiskaitymo, gausite patvirtinimo el. laišką į savo registruotą el. pašto adresą. Laiške bus pateikta visa užsakymo informacija, įskaitant užsakymo numerį, prekių sąrašą ir pristatymo detales. Išsaugokite šį el. laišką ateičiai.`
  },
  {
    id: 8,
    title: "Užsakymo stebėjimas",
    description: "Sužinokite, kaip stebėti savo užsakymo būseną ir pristatymo eigą.",
    icon: <Package className="w-6 h-6" />,
    videoUrl: "https://www.youtube.com/embed/hBouBFensck",
    content: `JOAZE.LT suteikia galimybę stebėti savo užsakymo būseną realiu laiku. Prisijungę prie savo paskyros, rasite skiltį 'Mano užsakymai', kurioje galėsite matyti visų savo užsakymų būseną, nuo apdorojimo iki išsiuntimo ir pristatymo. Taip pat gausite pranešimus el. paštu apie užsakymo būsenos pasikeitimus.`
  }
]

function ProductConfiguratorComponent() {
  const [config, setConfig] = useState<Record<string, string | number>>({
    metal: "silver",
    purity: "585",
    stones: 3,
    size: 18,
    comfort: "standard"
  })
  const [isShapeDiverActive, setIsShapeDiverActive] = useState(false)
  const paramsRef = useRef<HTMLDivElement>(null)
  const sessionManagerRef = useRef<any>(null)

  // Callback to handle ShapeDiver initialization
  const handleShapeDiverInit = useCallback((sessionManager: any) => {
    console.log('ShapeDiver initialized, setting active state');
    sessionManagerRef.current = sessionManager;
    setIsShapeDiverActive(true);
  }, []);

  // Effect to handle session manager updates
  useEffect(() => {
    if (sessionManagerRef.current) {
      console.log('Session manager available:', sessionManagerRef.current);
    }
  }, [sessionManagerRef.current]);

  const calculatePrice = () => {
    let price = productConfigurator.basePrice
    productConfigurator.parameters.forEach(param => {
      if (param.options) {
        const selectedOption = param.options.find(opt => opt.value === config[param.id])
        if (selectedOption) {
          price += selectedOption.priceModifier
        }
      } else if (param.id === 'stones') {
        price += ((config.stones as number) - 1) * (param.pricePerStone ?? 0)
      }
    })
    return price
  }

  const updateConfig = (paramId: string, value: string | number) => {
    setConfig(prev => {
      const newVal = typeof prev[paramId] === 'number' ? Number(value) : value
      return { ...prev, [paramId]: newVal }
    })
    
    // Update WebGI model if session manager is available
    if (sessionManagerRef.current) {
      const parameters: { [key: string]: string } = {}
      parameters[paramId] = value.toString()
      sessionManagerRef.current.customizeSession(parameters)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Preview */}
      <div className="space-y-6">
        <Card className="overflow-hidden bg-slate-800 border-slate-700">
          <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800">
            <WebgiViewer paramsRef={paramsRef} setSessionManager={handleShapeDiverInit} />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">{productConfigurator.name}</h3>
                <p className="text-slate-300">Individualiai konfigūruojamas</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-amber-400">€{calculatePrice()}</div>
                <div className="text-sm text-slate-400">su PVM</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="fix-1a2b3c">
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5 text-amber-400" />
              Kaina keičiasi realiu laiku
            </CardTitle>
          </CardHeader>
          <CardContent className="fix-1a2b3c">
            <p className="text-slate-300">
              Kaina automatiškai atnaujinama pagal jūsų pasirinkimus ir dabartines metalų rinkos kainas.
              Galutinė kaina gali šiek tiek skirtis dėl rinkos svyravimų.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Panel */}
      <div className="space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="fix-1a2b3c">
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="w-5 h-5 text-amber-400" />
              Konfigūratorius
            </CardTitle>
            <CardDescription className="text-slate-300">
              {isShapeDiverActive 
                ? "ShapeDiver parametrai - keiskite 3D modelį realiu laiku"
                : "Pritaikykite žiedą pagal savo pageidavimus. Spustelėkite info piktogramas daugiau informacijos."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ShapeDiver parameters container */}
            <div ref={paramsRef} className="shapediver-params-container" />
            
            {/* Fallback React parameters - only show when ShapeDiver is not active */}
            {!isShapeDiverActive && productConfigurator.parameters.map((param) => (
              <div key={param.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="text-amber-400">{param.icon}</div>
                  <span className="font-medium text-white">{param.name}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-300 hover:text-white hover:bg-slate-700">
                          <Info className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-slate-800 border-slate-600 text-white">
                        <p>{param.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-300 hover:text-white hover:bg-slate-700">
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-slate-800 border-slate-600">
                      <DialogHeader className="fix-1a2b3c">
                        <DialogTitle className="flex items-center gap-2 text-white">
                          <div className="text-amber-400">{param.icon}</div>
                          {param.name}
                        </DialogTitle>
                        <DialogDescription className="text-slate-300">
                          {param.detailedInfo}
                        </DialogDescription>
                      </DialogHeader>
                      {param.options && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-white">Galimi pasirinkimai:</h4>
                          {param.options.map((option) => (
                            <div key={option.value} className="p-3 border border-slate-600 rounded-lg bg-slate-700">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-white">{option.label}</div>
                                  <div className="text-sm text-slate-300">{option.description}</div>
                                </div>
                                {option.priceModifier > 0 && (
                                  <Badge variant="secondary" className="bg-amber-500 text-slate-900">+€{option.priceModifier}</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>

                {param.options ? (
                  <Select value={config[param.id]} onValueChange={(value: string) => updateConfig(param.id, value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {param.options.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                          <div className="flex justify-between items-center w-full">
                            <span>{option.label}</span>
                            {option.priceModifier > 0 && (
                              <Badge variant="secondary" className="ml-2 bg-amber-500 text-slate-900">+€{option.priceModifier}</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-300">
                        {param.id === 'stones' ? `${config[param.id]} ${config[param.id] === 1 ? 'akmuo' : 'akmenys'}` : 
                         param.id === 'size' ? `${config[param.id]} mm` : config[param.id]}
                      </span>
                      {param.id === 'stones' && Number(config[param.id]) > 1 && (
                        <Badge variant="secondary" className="bg-amber-500 text-slate-900">+€{(Number(config[param.id]) - 1) * (param.pricePerStone ?? 0)}</Badge>
                      )}
                    </div>
                    <Slider
                      value={[config[param.id]]}
                      defaultValue={[config[param.id]]}
                      onValueChange={(value: any) => updateConfig(param.id, value[0])}
                      min={param.min}
                      max={param.max}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{param.min}</span>
                      <span>{param.max}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Button variant="default" size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Įdėti į krepšelį - €{calculatePrice()}
        </Button>
      </div>
    </div>
  )
}

function App() {
  const [selectedStep, setSelectedStep] = useState(1)
  const [viewMode, setViewMode] = useState('guide') // 'guide', 'overview', 'configurator'

  const currentStep = learningSteps.find(step => step.id === selectedStep)

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="bg-slate-800/95 backdrop-blur-sm shadow-lg border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-slate-900 font-bold text-xl">J</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    JOAZE.LT
                  </h1>
                  <p className="text-sm text-slate-300">Interaktyvus vartotojo vadovas</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'overview' ? 'default' : 'outline'}
                  size="default"
                  className={viewMode === 'overview' ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                  onClick={() => setViewMode('overview')}
                >
                  Apžvalga
                </Button>
                <Button
                  variant={viewMode === 'guide' ? 'default' : 'outline'}
                  size="default"
                  className={viewMode === 'guide' ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                  onClick={() => setViewMode('guide')}
                >
                  Detalūs žingsniai
                </Button>
                <Button
                  variant={viewMode === 'configurator' ? 'default' : 'outline'}
                  size="default"
                  className={viewMode === 'configurator' ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                  onClick={() => setViewMode('configurator')}
                >
                  Konfigūratorius
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {viewMode === 'overview' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-white text-center">Mokymosi Vadovo Apžvalga</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningSteps.map(step => (
                  <Card 
                    key={step.id} 
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-slate-800 border-slate-700 hover:border-amber-500/50 hover:bg-slate-750"
                    onClick={() => {
                      setSelectedStep(step.id);
                      setViewMode('guide');
                    }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">{step.id}. {step.title}</CardTitle>
                      <div className="text-amber-400">{step.icon}</div>
                    </CardHeader>
                    <CardContent className="fix-1a2b3c">
                      <p className="text-sm text-slate-300">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button 
                  variant="default"
                  size="lg" 
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                  onClick={() => {
                    // Create a comprehensive text file with all learning steps
                    const guideContent = `JOAZE.LT - Interaktyvus Vartotojo Vadovas
==================================================

${learningSteps.map(step => `
${step.id}. ${step.title}
${'='.repeat(step.title.length + 3)}

${step.description}

${step.content}

Video: ${step.videoUrl || 'Nėra vaizdo įrašo'}

${'='.repeat(50)}
`).join('\n')}

© ${new Date().getFullYear()} JOAZE.LT. Visos teisės saugomos.`;

                    const blob = new Blob([guideContent], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'JOAZE_Vartotojo_Vadovas.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                    <Download className="w-5 h-5 mr-2" />
                  Atsisiųsti Vadovą (TXT)
                </Button>
              </div>
            </div>
          )}

          {viewMode === 'guide' && currentStep && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-1">
                <Card className="sticky top-24 bg-slate-800 border-slate-700">
                  <CardHeader className="fix-1a2b3c">
                    <CardTitle className="text-white">Mokymosi Žingsniai</CardTitle>
                  </CardHeader>
                  <CardContent className="fix-1a2b3c">
                    <nav>
                      <ul className="space-y-2">
                        {learningSteps.map(step => (
                          <li key={step.id}>
                            <Button
                              variant={selectedStep === step.id ? 'default' : 'ghost'}
                              size="lg"
                              className={`w-full justify-start ${
                                selectedStep === step.id 
                                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' 
                                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                              }`}
                              onClick={() => setSelectedStep(step.id)}
                            >
                              {step.id}. {step.title}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </CardContent>
                </Card>
              </aside>

              {/* Step Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="fix-1a2b3c">
                    <CardTitle className="text-2xl font-bold text-white">{currentStep.id}. {currentStep.title}</CardTitle>
                    <CardDescription className="text-slate-300">{currentStep.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {currentStep.videoUrl && (
                      <div className="video-responsive rounded-lg overflow-hidden shadow-xl">
                        <iframe
                          src={currentStep.videoUrl}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={currentStep.title}
                        ></iframe>
                      </div>
                    )}

                    <div className="prose prose-invert max-w-none">
                      <p className="text-slate-200 leading-relaxed">{currentStep.content}</p>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                        onClick={() => setSelectedStep(prev => prev - 1)}
                        disabled={selectedStep === 1}
                      >
                        <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                        Ankstesnis žingsnis
                      </Button>
                      <Button 
                        variant="default"
                        size="lg"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                        onClick={() => setSelectedStep(prev => prev + 1)}
                        disabled={selectedStep === learningSteps.length}
                      >
                        Kitas žingsnis
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {viewMode === 'configurator' && (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-white text-center">Produkto Konfigūratorius</h2>
              <ProductConfiguratorComponent />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8 mt-12 border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-300">&copy; {new Date().getFullYear()} JOAZE.LT. Visos teisės saugomos.</p>
            <p className="text-sm text-slate-400 mt-2">Sukurta su meile ir AI</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App


