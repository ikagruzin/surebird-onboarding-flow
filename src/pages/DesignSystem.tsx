import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Lucide icons (every icon used across the platform) ──
import {
  Check, CheckCircle, CheckCircle2, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Plus, Minus, X, Info, Mail, Phone,
  Heart, Trash2, Shield, ShieldCheck, Lock, Calendar, Play, Star,
  Sparkles, Upload, FileText, ArrowRight, ArrowLeft, HelpCircle,
  Monitor, Smartphone, Lightbulb, MessageCircle, Globe, User,
  LayoutGrid, Layers, GalleryHorizontal, QrCode, RefreshCw,
  Loader2, RotateCcw, Home, Plane, Umbrella, Car, Scale, Zap,
  ShoppingBag, Briefcase, KeyRound, TrendingUp, Circle,
  GripVertical, MoreHorizontal, type LucideIcon,
} from "lucide-react";

// ── UI Components ──
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

// ── Custom components ──
import FlowSwitcher from "@/components/onboarding/FlowSwitcher";
import { getAllFlows } from "@/config/flows";

/* ─────────────────────────── COLOR TOKENS ─────────────────────────── */

const COLOR_TOKENS = [
  { name: "--background", label: "Background", cssVar: "210 20% 98%" },
  { name: "--foreground", label: "Foreground", cssVar: "220 20% 10%" },
  { name: "--primary", label: "Primary", cssVar: "214 100% 50%" },
  { name: "--primary-foreground", label: "Primary Foreground", cssVar: "0 0% 100%" },
  { name: "--secondary", label: "Secondary", cssVar: "210 20% 96%" },
  { name: "--secondary-foreground", label: "Secondary Foreground", cssVar: "220 20% 10%" },
  { name: "--muted", label: "Muted", cssVar: "210 15% 95%" },
  { name: "--muted-foreground", label: "Muted Foreground", cssVar: "215 14% 46%" },
  { name: "--accent", label: "Accent (Green)", cssVar: "121 72% 42%" },
  { name: "--accent-foreground", label: "Accent Foreground", cssVar: "0 0% 100%" },
  { name: "--destructive", label: "Destructive", cssVar: "0 84% 60%" },
  { name: "--destructive-foreground", label: "Destructive Foreground", cssVar: "0 0% 100%" },
  { name: "--success", label: "Success", cssVar: "121 72% 42%" },
  { name: "--success-foreground", label: "Success Foreground", cssVar: "0 0% 100%" },
  { name: "--info", label: "Info", cssVar: "214 100% 50%" },
  { name: "--info-light", label: "Info Light", cssVar: "214 100% 96%" },
  { name: "--savings", label: "Savings", cssVar: "121 72% 42%" },
  { name: "--border", label: "Border", cssVar: "214 20% 90%" },
  { name: "--input", label: "Input", cssVar: "214 20% 90%" },
  { name: "--ring", label: "Ring", cssVar: "214 100% 50%" },
  { name: "--card", label: "Card", cssVar: "0 0% 100%" },
  { name: "--card-foreground", label: "Card Foreground", cssVar: "220 20% 10%" },
  { name: "--subtitle", label: "Subtitle", cssVar: "0 0% 19%" },
  { name: "--tab-border", label: "Tab Border", cssVar: "0 0% 84%" },
];

/* ─────────────────────────── ICON REGISTRY ─────────────────────────── */

const ALL_ICONS: { name: string; component: LucideIcon }[] = [
  { name: "Check", component: Check },
  { name: "CheckCircle", component: CheckCircle },
  { name: "CheckCircle2", component: CheckCircle2 },
  { name: "ChevronDown", component: ChevronDown },
  { name: "ChevronUp", component: ChevronUp },
  { name: "ChevronLeft", component: ChevronLeft },
  { name: "ChevronRight", component: ChevronRight },
  { name: "Plus", component: Plus },
  { name: "Minus", component: Minus },
  { name: "X", component: X },
  { name: "Info", component: Info },
  { name: "Mail", component: Mail },
  { name: "Phone", component: Phone },
  { name: "Heart", component: Heart },
  { name: "Trash2", component: Trash2 },
  { name: "Shield", component: Shield },
  { name: "ShieldCheck", component: ShieldCheck },
  { name: "Lock", component: Lock },
  { name: "Calendar", component: Calendar },
  { name: "Play", component: Play },
  { name: "Star", component: Star },
  { name: "Sparkles", component: Sparkles },
  { name: "Upload", component: Upload },
  { name: "FileText", component: FileText },
  { name: "ArrowRight", component: ArrowRight },
  { name: "ArrowLeft", component: ArrowLeft },
  { name: "HelpCircle", component: HelpCircle },
  { name: "Monitor", component: Monitor },
  { name: "Smartphone", component: Smartphone },
  { name: "Lightbulb", component: Lightbulb },
  { name: "MessageCircle", component: MessageCircle },
  { name: "Globe", component: Globe },
  { name: "User", component: User },
  { name: "LayoutGrid", component: LayoutGrid },
  { name: "Layers", component: Layers },
  { name: "GalleryHorizontal", component: GalleryHorizontal },
  { name: "QrCode", component: QrCode },
  { name: "RefreshCw", component: RefreshCw },
  { name: "Loader2", component: Loader2 },
  { name: "RotateCcw", component: RotateCcw },
  { name: "Home", component: Home },
  { name: "Plane", component: Plane },
  { name: "Umbrella", component: Umbrella },
  { name: "Car", component: Car },
  { name: "Scale", component: Scale },
  { name: "Zap", component: Zap },
  { name: "ShoppingBag", component: ShoppingBag },
  { name: "Briefcase", component: Briefcase },
  { name: "KeyRound", component: KeyRound },
  { name: "TrendingUp", component: TrendingUp },
  { name: "Circle", component: Circle },
  { name: "GripVertical", component: GripVertical },
  { name: "MoreHorizontal", component: MoreHorizontal },
];

/* ─────────────────────────── SECTION WRAPPER ─────────────────────────── */

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-12">
    <h2 className="text-xl font-bold text-foreground mb-1">{title}</h2>
    <Separator className="mb-6" />
    {children}
  </section>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</h3>
    {children}
  </div>
);

/* ═══════════════════════════ MAIN PAGE ═══════════════════════════ */

const DesignSystem = () => {
  const navigate = useNavigate();
  const [demoRadio, setDemoRadio] = useState("option-1");
  const [demoSwitch, setDemoSwitch] = useState(false);
  const [demoSlider, setDemoSlider] = useState([50]);
  const [demoCheck, setDemoCheck] = useState(false);
  const [demoInput, setDemoInput] = useState("");
  const [demoFloat, setDemoFloat] = useState("");
  const [demoTab, setDemoTab] = useState("tab1");

  const handleFlowSwitch = (flowId: string) => {
    if (flowId === "c") {
      navigate("/test-flows/house");
    } else {
      navigate(`/?flow=${flowId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Flow Switcher */}
      <FlowSwitcher currentFlowId="design-system" onSwitch={handleFlowSwitch} />

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Design System</h1>
        <p className="text-muted-foreground text-base">
          Living reference of all tokens, components, and icons used across the platform.
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="max-w-5xl mx-auto px-6 pb-32">

          {/* ── 1. COLOR PALETTE ── */}
          <Section title="Color Palette">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {COLOR_TOKENS.map((token) => (
                <div key={token.name} className="flex flex-col gap-1.5">
                  <div
                    className="h-16 rounded-xl border border-border"
                    style={{ backgroundColor: `hsl(${token.cssVar})` }}
                  />
                  <span className="text-xs font-medium text-foreground">{token.label}</span>
                  <code className="text-[10px] text-muted-foreground font-mono">{token.name}</code>
                  <code className="text-[10px] text-muted-foreground font-mono">hsl({token.cssVar})</code>
                </div>
              ))}
            </div>
          </Section>

          {/* ── 2. TYPOGRAPHY ── */}
          <Section title="Typography">
            <SubSection title="Font Family">
              <p className="text-sm text-muted-foreground mb-4">
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">Inter</code> — system-ui, -apple-system, sans-serif
              </p>
            </SubSection>

            <SubSection title="Headings">
              <div className="space-y-3">
                <div><span className="text-4xl font-bold text-foreground">Heading 1</span> <span className="text-xs text-muted-foreground ml-2">text-4xl / font-bold</span></div>
                <div><span className="text-3xl font-bold text-foreground">Heading 2</span> <span className="text-xs text-muted-foreground ml-2">text-3xl / font-bold</span></div>
                <div><span className="text-2xl font-semibold text-foreground">Heading 3</span> <span className="text-xs text-muted-foreground ml-2">text-2xl / font-semibold</span></div>
                <div><span className="text-xl font-semibold text-foreground">Heading 4</span> <span className="text-xs text-muted-foreground ml-2">text-xl / font-semibold</span></div>
                <div><span className="text-lg font-medium text-foreground">Heading 5</span> <span className="text-xs text-muted-foreground ml-2">text-lg / font-medium</span></div>
              </div>
            </SubSection>

            <SubSection title="Body & Utility Text">
              <div className="space-y-2">
                <div><span className="text-base text-foreground">Body — base (16px)</span> <span className="text-xs text-muted-foreground ml-2">text-base</span></div>
                <div><span className="text-sm text-foreground">Body — small (14px)</span> <span className="text-xs text-muted-foreground ml-2">text-sm</span></div>
                <div><span className="text-xs text-muted-foreground">Caption / Helper (12px)</span> <span className="text-xs text-muted-foreground ml-2">text-xs / text-muted-foreground</span></div>
                <div><span className="text-sm text-subtitle">Subtitle (#313131)</span> <span className="text-xs text-muted-foreground ml-2">text-subtitle</span></div>
              </div>
            </SubSection>

            <SubSection title="Font Weights">
              <div className="flex flex-wrap gap-6">
                {[
                  { w: "font-normal", label: "400 Regular" },
                  { w: "font-medium", label: "500 Medium" },
                  { w: "font-semibold", label: "600 Semibold" },
                  { w: "font-bold", label: "700 Bold" },
                  { w: "font-extrabold", label: "800 Extra Bold" },
                ].map((f) => (
                  <span key={f.w} className={`text-base text-foreground ${f.w}`}>{f.label}</span>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ── 3. SPACING & RADIUS ── */}
          <Section title="Spacing & Border Radius">
            <SubSection title="Border Radius Tokens">
              <div className="flex flex-wrap gap-4">
                {[
                  { label: "sm", cls: "rounded-sm", val: "calc(0.625rem - 4px)" },
                  { label: "md", cls: "rounded-md", val: "calc(0.625rem - 2px)" },
                  { label: "lg", cls: "rounded-lg", val: "0.625rem" },
                  { label: "xl", cls: "rounded-xl", val: "0.75rem" },
                  { label: "2xl", cls: "rounded-2xl", val: "1rem" },
                  { label: "3xl", cls: "rounded-3xl", val: "1.5rem" },
                  { label: "full", cls: "rounded-full", val: "9999px" },
                ].map((r) => (
                  <div key={r.label} className="flex flex-col items-center gap-1.5">
                    <div className={`w-16 h-16 bg-primary ${r.cls}`} />
                    <code className="text-[10px] text-muted-foreground">{r.label}</code>
                    <code className="text-[10px] text-muted-foreground">{r.val}</code>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Key Conventions">
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Question containers: <code className="bg-muted px-1 rounded text-xs">rounded-3xl</code> + <code className="bg-muted px-1 rounded text-xs">shadow-sm</code></li>
                <li>Product cards: <code className="bg-muted px-1 rounded text-xs">rounded-2xl</code> + 2px stroke + <code className="bg-muted px-1 rounded text-xs">hover:shadow-md</code></li>
                <li>CTA buttons: <code className="bg-muted px-1 rounded text-xs">rounded-full</code></li>
                <li>Selected state: blue stroke (<code className="bg-muted px-1 rounded text-xs">#0177E5</code>) + 10% blue bg</li>
              </ul>
            </SubSection>
          </Section>

          {/* ── 4. BUTTONS ── */}
          <Section title="Buttons">
            <SubSection title="Variants">
              <div className="flex flex-wrap gap-3 items-center">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </SubSection>

            <SubSection title="Sizes">
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Plus className="w-4 h-4" /></Button>
              </div>
            </SubSection>

            <SubSection title="States">
              <div className="flex flex-wrap gap-3 items-center">
                <Button>Enabled</Button>
                <Button disabled>Disabled</Button>
              </div>
            </SubSection>

            <SubSection title="CTA / Primary Action (3D Gradient)">
              <button
                className="inline-flex items-center gap-2 text-success-foreground px-7 py-3 rounded-full font-semibold text-base transition-all"
                style={{
                  background: "linear-gradient(180deg, hsl(121 72% 48%) 0%, hsl(121 72% 38%) 100%)",
                  boxShadow: "0 4px 12px -2px hsla(121, 72%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)",
                }}
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-muted-foreground mt-2">Green 3D gradient CTA — used in StickyFooter</p>
            </SubSection>
          </Section>

          {/* ── 5. FORM CONTROLS ── */}
          <Section title="Form Controls">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SubSection title="Input">
                <Input placeholder="Standard input" value={demoInput} onChange={(e) => setDemoInput(e.target.value)} />
              </SubSection>

              <SubSection title="Floating Label Input">
                <FloatingLabelInput label="Email address" value={demoFloat} onChange={(e) => setDemoFloat(e.target.value)} />
              </SubSection>

              <SubSection title="Textarea">
                <Textarea placeholder="Enter your message..." />
              </SubSection>

              <SubSection title="Select">
                <Select>
                  <SelectTrigger><SelectValue placeholder="Choose option" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Option A</SelectItem>
                    <SelectItem value="b">Option B</SelectItem>
                    <SelectItem value="c">Option C</SelectItem>
                  </SelectContent>
                </Select>
              </SubSection>

              <SubSection title="Checkbox">
                <div className="flex items-center gap-2">
                  <Checkbox checked={demoCheck} onCheckedChange={(v) => setDemoCheck(!!v)} id="demo-check" />
                  <Label htmlFor="demo-check">Accept terms</Label>
                </div>
              </SubSection>

              <SubSection title="Switch">
                <div className="flex items-center gap-2">
                  <Switch checked={demoSwitch} onCheckedChange={setDemoSwitch} id="demo-switch" />
                  <Label htmlFor="demo-switch">Toggle option</Label>
                </div>
              </SubSection>

              <SubSection title="Radio Group">
                <RadioGroup value={demoRadio} onValueChange={setDemoRadio}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="option-1" id="r1" />
                    <Label htmlFor="r1">Option 1</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="option-2" id="r2" />
                    <Label htmlFor="r2">Option 2</Label>
                  </div>
                </RadioGroup>
              </SubSection>

              <SubSection title="Slider">
                <Slider value={demoSlider} onValueChange={setDemoSlider} max={100} step={1} />
                <p className="text-xs text-muted-foreground mt-1">Value: {demoSlider[0]}</p>
              </SubSection>
            </div>
          </Section>

          {/* ── 6. CARDS ── */}
          <Section title="Cards">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>Default card with header and content.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Card body content goes here.</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>

              <div className="rounded-2xl border-2 border-border p-6 hover:shadow-md transition-shadow bg-card">
                <h4 className="text-base font-semibold text-foreground mb-1">Product Card</h4>
                <p className="text-sm text-muted-foreground">rounded-2xl · 2px stroke · hover:shadow-md</p>
              </div>

              <div className="rounded-2xl border-2 border-primary bg-primary/10 p-6 shadow-sm">
                <h4 className="text-base font-semibold text-foreground mb-1">Selected State</h4>
                <p className="text-sm text-muted-foreground">border-primary · bg-primary/10</p>
              </div>

              <div className="rounded-3xl border border-border p-6 shadow-sm bg-card">
                <h4 className="text-base font-semibold text-foreground mb-1">Question Container</h4>
                <p className="text-sm text-muted-foreground">rounded-3xl · shadow-sm</p>
              </div>
            </div>
          </Section>

          {/* ── 7. FEEDBACK & STATUS ── */}
          <Section title="Feedback & Status">
            <div className="space-y-6">
              <SubSection title="Badges">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <span className="inline-flex items-center gap-1 bg-success/10 border border-success/20 rounded-full px-3 py-1">
                    <span className="text-sm font-bold text-success">€ 240,00</span>
                  </span>
                </div>
              </SubSection>

              <SubSection title="Progress">
                <div className="space-y-3 max-w-md">
                  <Progress value={25} />
                  <Progress value={60} />
                  <Progress value={100} />
                </div>
              </SubSection>

              <SubSection title="Skeleton Loading">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </SubSection>

              <SubSection title="Tooltip">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tooltip content</p>
                  </TooltipContent>
                </Tooltip>
              </SubSection>
            </div>
          </Section>

          {/* ── 8. TABS ── */}
          <Section title="Tabs">
            <Tabs value={demoTab} onValueChange={setDemoTab} className="max-w-md">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1"><p className="text-sm text-muted-foreground p-4">Content for Tab 1</p></TabsContent>
              <TabsContent value="tab2"><p className="text-sm text-muted-foreground p-4">Content for Tab 2</p></TabsContent>
              <TabsContent value="tab3"><p className="text-sm text-muted-foreground p-4">Content for Tab 3</p></TabsContent>
            </Tabs>
          </Section>

          {/* ── 9. ACCORDION ── */}
          <Section title="Accordion">
            <Accordion type="single" collapsible className="max-w-md">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is this design system?</AccordionTrigger>
                <AccordionContent>A living reference of all tokens, components, and icons used across the platform.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I add a new component?</AccordionTrigger>
                <AccordionContent>Add it via shadcn/ui CLI and register it in this design system page.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          {/* ── 10. DIALOG ── */}
          <Section title="Dialog">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>This is a standard dialog component.</DialogDescription>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">Dialog body content.</p>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Section>

          {/* ── 11. SEGMENTED CONTROLS (Custom Pattern) ── */}
          <Section title="Segmented Controls">
            <SubSection title="Segmented Buttons (used in flows)">
              <div className="flex gap-2">
                {["Option A", "Option B", "Option C"].map((opt, i) => (
                  <button
                    key={opt}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      i === 0
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Selected: border-primary + bg-primary/10 · Unselected: border-border</p>
            </SubSection>

            <SubSection title="Chip Selectors (multi-select)">
              <div className="flex flex-wrap gap-2">
                {["Chip 1", "Chip 2", "Chip 3"].map((chip, i) => (
                  <button
                    key={chip}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                      i === 1
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {i === 1 && <Check className="w-3.5 h-3.5 inline mr-1" />}
                    {chip}
                  </button>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ── 12. CUSTOM COMPONENTS ── */}
          <Section title="Custom Components">
            <SubSection title="Sticky Footer (pattern)">
              <div className="relative rounded-3xl border border-border bg-card px-6 py-4 flex items-center justify-between shadow-lg max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Estimated savings:</span>
                  <span className="inline-flex items-center gap-1 bg-success/10 border border-success/20 rounded-full px-3 py-1">
                    <span className="text-lg font-bold text-success">€ 240,00</span>
                  </span>
                </div>
                <button
                  className="inline-flex items-center gap-2 text-success-foreground px-7 py-3 rounded-full font-semibold text-base"
                  style={{
                    background: "linear-gradient(180deg, hsl(121 72% 48%) 0%, hsl(121 72% 38%) 100%)",
                    boxShadow: "0 4px 12px -2px hsla(121, 72%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)",
                  }}
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">StickyFooter — fixed bottom bar with savings badge + green CTA</p>
            </SubSection>

            <SubSection title="Flow Switcher (pattern)">
              <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 shadow-lg text-sm font-medium text-foreground w-fit">
                <span className="w-2 h-2 rounded-full bg-success" />
                Flow A — Quick Scan
                <ChevronDown className="w-4 h-4" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">FlowSwitcher — fixed top-right dropdown for switching test flows</p>
            </SubSection>
          </Section>

          {/* ── 13. ICONS ── */}
          <Section title="Icons (Lucide)">
            <p className="text-sm text-muted-foreground mb-4">
              {ALL_ICONS.length} icons actively used across the platform. All from <code className="bg-muted px-1 rounded text-xs">lucide-react</code>.
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {ALL_ICONS.map(({ name, component: Icon }) => (
                <div key={name} className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-muted transition-colors">
                  <Icon className="w-5 h-5 text-foreground" />
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">{name}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── 14. ANIMATIONS ── */}
          <Section title="Animations">
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">fade-in</code>
                <span>0.4s ease-out — opacity 0→1 + translateY 8→0</span>
              </div>
              <div className="flex items-center gap-3">
                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">slide-in</code>
                <span>0.3s ease-out — opacity 0→1 + translateX 16→0</span>
              </div>
              <div className="flex items-center gap-3">
                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">savings-pop</code>
                <span>0.4s ease-out — scale 1→1.18→1</span>
              </div>
              <div className="flex items-center gap-3">
                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">accordion-down/up</code>
                <span>0.2s ease-out — height animation</span>
              </div>
            </div>
          </Section>

        </div>
      </ScrollArea>
    </div>
  );
};

export default DesignSystem;
