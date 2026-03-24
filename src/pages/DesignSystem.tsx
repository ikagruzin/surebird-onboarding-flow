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

const SEMANTIC_TOKENS = [
  { name: "--background", label: "Background", cssVar: "210 20% 98%" },
  { name: "--foreground", label: "Foreground", cssVar: "220 20% 10%" },
  { name: "--primary", label: "Primary", cssVar: "214 100% 50%" },
  { name: "--primary-foreground", label: "Primary FG", cssVar: "0 0% 100%" },
  { name: "--secondary", label: "Secondary", cssVar: "210 20% 96%" },
  { name: "--secondary-foreground", label: "Secondary FG", cssVar: "220 20% 10%" },
  { name: "--muted", label: "Muted", cssVar: "210 15% 95%" },
  { name: "--muted-foreground", label: "Muted FG", cssVar: "215 14% 46%" },
  { name: "--accent", label: "Accent (Green)", cssVar: "121 72% 42%" },
  { name: "--accent-foreground", label: "Accent FG", cssVar: "0 0% 100%" },
  { name: "--destructive", label: "Destructive", cssVar: "0 84% 60%" },
  { name: "--destructive-foreground", label: "Destructive FG", cssVar: "0 0% 100%" },
  { name: "--success", label: "Success", cssVar: "121 72% 42%" },
  { name: "--success-foreground", label: "Success FG", cssVar: "0 0% 100%" },
  { name: "--info", label: "Info", cssVar: "214 100% 50%" },
  { name: "--info-light", label: "Info Light", cssVar: "214 100% 96%" },
  { name: "--savings", label: "Savings", cssVar: "121 72% 42%" },
  { name: "--border", label: "Border", cssVar: "214 20% 90%" },
  { name: "--input", label: "Input", cssVar: "214 20% 90%" },
  { name: "--ring", label: "Ring", cssVar: "214 100% 50%" },
  { name: "--card", label: "Card", cssVar: "0 0% 100%" },
  { name: "--card-foreground", label: "Card FG", cssVar: "220 20% 10%" },
  { name: "--subtitle", label: "Subtitle", cssVar: "0 0% 19%" },
  { name: "--tab-border", label: "Tab Border", cssVar: "0 0% 84%" },
  { name: "--popover", label: "Popover", cssVar: "0 0% 100%" },
  { name: "--popover-foreground", label: "Popover FG", cssVar: "220 20% 10%" },
];

const SIDEBAR_TOKENS = [
  { name: "--sidebar-background", label: "Sidebar BG", cssVar: "0 0% 100%" },
  { name: "--sidebar-foreground", label: "Sidebar FG", cssVar: "220 15% 20%" },
  { name: "--sidebar-primary", label: "Sidebar Primary", cssVar: "214 100% 50%" },
  { name: "--sidebar-primary-foreground", label: "Sidebar Primary FG", cssVar: "0 0% 100%" },
  { name: "--sidebar-accent", label: "Sidebar Accent", cssVar: "214 100% 96%" },
  { name: "--sidebar-accent-foreground", label: "Sidebar Accent FG", cssVar: "214 100% 50%" },
  { name: "--sidebar-border", label: "Sidebar Border", cssVar: "214 20% 92%" },
  { name: "--sidebar-ring", label: "Sidebar Ring", cssVar: "214 100% 50%" },
];

const HARDCODED_COLORS = [
  { name: "bg-white", label: "White (bg-white)", color: "#ffffff", usage: "Input fields, form cards, tab backgrounds" },
  { name: "bg-black/80", label: "Overlay Dark 80%", color: "rgba(0,0,0,0.8)", usage: "Dialog/Drawer backdrops" },
  { name: "bg-black/40", label: "Overlay Dark 40%", color: "rgba(0,0,0,0.4)", usage: "Modal backdrops, help overlays" },
  { name: "#0177E5", label: "Selected Blue (hex)", color: "#0177E5", usage: "StepOne selected card border" },
  { name: "#0385FF/10", label: "Selected Blue BG (hex)", color: "rgba(3,133,255,0.1)", usage: "StepOne selected card background" },
  { name: "bg-blue-50", label: "Blue 50 (Tailwind)", color: "#eff6ff", usage: "StepOffer badge backgrounds" },
  { name: "text-blue-600", label: "Blue 600 (Tailwind)", color: "#2563eb", usage: "StepOffer badge text" },
  { name: "text-red-300", label: "Red 300 (Tailwind)", color: "#fca5a5", usage: "Toast destructive close icon" },
  { name: "text-red-50", label: "Red 50 (Tailwind)", color: "#fef2f2", usage: "Toast destructive hover" },
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

const Section = ({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) => (
  <section className="mb-14" id={id}>
    <h2 className="text-xl font-bold text-foreground mb-1">{title}</h2>
    <Separator className="mb-6" />
    {children}
  </section>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
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
  const [demoToggle, setDemoToggle] = useState("phone");
  const [demoSegmented, setDemoSegmented] = useState("Option A");
  const [demoChip, setDemoChip] = useState<string[]>(["Chip 2"]);

  const handleFlowSwitch = (flowId: string) => {
    if (flowId === "c") {
      navigate("/test-flows/house");
    } else {
      navigate(`/?flow=${flowId}`);
    }
  };

  // Table of contents
  const TOC = [
    { id: "colors", label: "Colors" },
    { id: "typography", label: "Typography" },
    { id: "spacing", label: "Spacing & Radius" },
    { id: "buttons", label: "Buttons" },
    { id: "forms", label: "Form Controls" },
    { id: "cards", label: "Cards" },
    { id: "feedback", label: "Feedback & Status" },
    { id: "tabs", label: "Tabs" },
    { id: "accordion", label: "Accordion" },
    { id: "dialog", label: "Dialog" },
    { id: "selectors", label: "Segmented Controls" },
    { id: "overlays", label: "Overlays & Backdrops" },
    { id: "custom", label: "Custom Components" },
    { id: "icons", label: "Icons" },
    { id: "animations", label: "Animations" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Flow Switcher */}
      <FlowSwitcher currentFlowId="design-system" onSwitch={handleFlowSwitch} />

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-1">Design System</h1>
        <p className="text-muted-foreground text-base mb-6">
          Living reference of all tokens, components, and icons used across the platform.
        </p>

        {/* Table of Contents */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TOC.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="max-w-5xl mx-auto px-6 pb-32">

          {/* ── 1. COLOR PALETTE ── */}
          <Section title="Color Palette" id="colors">
            <Tabs defaultValue="tokens" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
                <TabsTrigger value="audit">Color Audit</TabsTrigger>
              </TabsList>

              <TabsContent value="tokens">
                <SubSection title="Semantic Tokens (from index.css)">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {SEMANTIC_TOKENS.map((token) => (
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
                </SubSection>

                <SubSection title="Sidebar Tokens">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {SIDEBAR_TOKENS.map((token) => (
                      <div key={token.name} className="flex flex-col gap-1.5">
                        <div
                          className="h-16 rounded-xl border border-border"
                          style={{ backgroundColor: `hsl(${token.cssVar})` }}
                        />
                        <span className="text-xs font-medium text-foreground">{token.label}</span>
                        <code className="text-[10px] text-muted-foreground font-mono">{token.name}</code>
                      </div>
                    ))}
                  </div>
                </SubSection>

                <SubSection title="Hardcoded / Non-Tokenized Colors (⚠️ used in codebase)">
                  <p className="text-xs text-destructive mb-3">These colors are used directly in components and are not part of the semantic token system. Consider tokenizing them.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {HARDCODED_COLORS.map((c) => (
                      <div key={c.name} className="flex flex-col gap-1.5">
                        <div
                          className="h-16 rounded-xl border border-border"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-xs font-medium text-foreground">{c.label}</span>
                        <code className="text-[10px] text-muted-foreground font-mono">{c.name}</code>
                        <p className="text-[10px] text-muted-foreground">{c.usage}</p>
                      </div>
                    ))}
                  </div>
                </SubSection>

                <SubSection title="Opacity Patterns">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "primary/5", cls: "bg-primary/5" },
                      { label: "primary/10", cls: "bg-primary/10" },
                      { label: "success/10", cls: "bg-success/10" },
                      { label: "destructive/10", cls: "bg-destructive/10" },
                    ].map((o) => (
                      <div key={o.label} className="flex flex-col gap-1.5">
                        <div className={`h-12 rounded-xl border border-border ${o.cls}`} />
                        <code className="text-[10px] text-muted-foreground font-mono">{o.label}</code>
                      </div>
                    ))}
                  </div>
                </SubSection>
              </TabsContent>

              <TabsContent value="audit">
                <p className="text-sm text-muted-foreground mb-4">
                  Every unique color used across the platform — flat view with color codes for quick reference and duplicate spotting.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {[
                    ...SEMANTIC_TOKENS.map((t) => ({ color: `hsl(${t.cssVar})`, code: `hsl(${t.cssVar})` })),
                    ...SIDEBAR_TOKENS.map((t) => ({ color: `hsl(${t.cssVar})`, code: `hsl(${t.cssVar})` })),
                    ...HARDCODED_COLORS.map((c) => ({ color: c.color, code: c.name })),
                    { color: "hsl(214 100% 50% / 0.05)", code: "primary/5" },
                    { color: "hsl(214 100% 50% / 0.1)", code: "primary/10" },
                    { color: "hsl(121 72% 42% / 0.1)", code: "success/10" },
                    { color: "hsl(0 84% 60% / 0.1)", code: "destructive/10" },
                  ]
                    .filter((v, i, a) => a.findIndex((x) => x.code === v.code) === i)
                    .map((item) => (
                      <div key={item.code} className="flex flex-col items-center gap-1.5">
                        <div
                          className="w-full h-14 rounded-lg border border-border"
                          style={{ backgroundColor: item.color }}
                        />
                        <code className="text-[10px] text-muted-foreground font-mono text-center leading-tight break-all">{item.code}</code>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </Section>

          {/* ── 2. TYPOGRAPHY ── */}
          <Section title="Typography" id="typography">
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

            <SubSection title="Question Label Convention">
              <p className="text-base font-semibold text-foreground mb-1">What is your name?</p>
              <p className="text-xs text-muted-foreground">Questions use <code className="bg-muted px-1 rounded text-[10px]">text-base font-semibold</code> — 48px gap between header and input.</p>
            </SubSection>
          </Section>

          {/* ── 3. SPACING & RADIUS ── */}
          <Section title="Spacing & Border Radius" id="spacing">
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
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>Question containers: <code className="bg-muted px-1 rounded text-xs">rounded-3xl</code> + <code className="bg-muted px-1 rounded text-xs">shadow-sm</code> + <code className="bg-muted px-1 rounded text-xs">border-2 border-input bg-white</code></li>
                <li>Product cards: <code className="bg-muted px-1 rounded text-xs">rounded-2xl</code> + 2px stroke + <code className="bg-muted px-1 rounded text-xs">hover:shadow-md</code></li>
                <li>CTA buttons: <code className="bg-muted px-1 rounded text-xs">rounded-full</code></li>
                <li>Section cards: <code className="bg-muted px-1 rounded text-xs">rounded-2xl border border-border bg-card p-6 shadow-sm</code></li>
                <li>Selected state: blue stroke <code className="bg-muted px-1 rounded text-xs">border-primary</code> + <code className="bg-muted px-1 rounded text-xs">bg-primary/10</code></li>
                <li>Chat bubbles: <code className="bg-muted px-1 rounded text-xs">rounded-2xl rounded-tl-md</code></li>
                <li>Input fields: <code className="bg-muted px-1 rounded text-xs">rounded-xl border-2 border-input bg-white</code></li>
              </ul>
            </SubSection>
          </Section>

          {/* ── 4. BUTTONS ── */}
          <Section title="Buttons" id="buttons">
            <SubSection title="shadcn Variants">
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

            <SubSection title="CTA / Primary Action (3D Green Gradient)">
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  className="inline-flex items-center gap-2 text-success-foreground px-7 py-3 rounded-full font-semibold text-base transition-all"
                  style={{
                    background: "linear-gradient(180deg, hsl(121 72% 48%) 0%, hsl(121 72% 38%) 100%)",
                    boxShadow: "0 4px 12px -2px hsla(121, 72%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)",
                  }}
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  disabled
                  className="inline-flex items-center gap-2 text-success-foreground px-7 py-3 rounded-full font-semibold text-base opacity-40 cursor-not-allowed"
                  style={{
                    background: "linear-gradient(180deg, hsl(121 72% 48%) 0%, hsl(121 72% 38%) 100%)",
                    boxShadow: "0 4px 12px -2px hsla(121, 72%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)",
                  }}
                >
                  Disabled <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Used in: StickyFooter, StepSuccess, StepPreferences — Green 3D gradient with inset highlight</p>
            </SubSection>

            <SubSection title="Back Button (StickyFooter)">
              <button className="inline-flex items-center gap-2 text-foreground px-4 py-3 rounded-full font-medium text-base hover:bg-muted transition-colors">
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <p className="text-xs text-muted-foreground mt-2">Used in: StickyFooter when showSavings=false</p>
            </SubSection>

            <SubSection title="Inverted Toggle Button">
              <div className="flex gap-2">
                <button
                  onClick={() => setDemoToggle("phone")}
                  className={`px-5 py-3 rounded-full border text-sm font-medium transition-all ${
                    demoToggle === "phone"
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <Phone className="w-4 h-4 inline mr-1.5" /> Phone
                </button>
                <button
                  onClick={() => setDemoToggle("email")}
                  className={`px-5 py-3 rounded-full border text-sm font-medium transition-all ${
                    demoToggle === "email"
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <Mail className="w-4 h-4 inline mr-1.5" /> Email
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Used in: StepPreferences contact method & tab selectors — active state inverts fg/bg</p>
            </SubSection>

            <SubSection title="Outline Pill Button (Tab-style)">
              <div className="flex gap-2">
                <button className="h-[48px] px-5 rounded-full border border-tab-border bg-card flex items-center justify-center text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Tab Item
                </button>
                <button className="h-[48px] px-4 rounded-full border border-tab-border bg-card flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Used in: StepPreferences add-product tabs — 1px stroke, no shadow</p>
            </SubSection>

            <SubSection title="WhatsApp CTA">
              <button className="w-56 flex items-center justify-center gap-2 border border-border rounded-full py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <MessageCircle className="w-4 h-4 text-success" />
                Chat via WhatsApp
              </button>
              <p className="text-xs text-muted-foreground mt-2">Used in: AskTacoFloat, Sidebar</p>
            </SubSection>

            <SubSection title="Reset / Utility Button">
              <button className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 font-medium transition-colors">
                <RotateCcw className="w-4 h-4" />
                Reset Sandbox
              </button>
              <p className="text-xs text-muted-foreground mt-2">Used in: HouseInsurance test page</p>
            </SubSection>
          </Section>

          {/* ── 5. FORM CONTROLS ── */}
          <Section title="Form Controls" id="forms">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SubSection title="Input (Standard)">
                <Input placeholder="Standard input" value={demoInput} onChange={(e) => setDemoInput(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">border-2 · bg-white · rounded-md</p>
              </SubSection>

              <SubSection title="Floating Label Input">
                <FloatingLabelInput label="Email address" value={demoFloat} onChange={(e) => setDemoFloat(e.target.value)} />
              </SubSection>

              <SubSection title="Custom Flow Input">
                <input
                  className="w-full rounded-xl border-2 border-input bg-white px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Flow-style input (rounded-xl)"
                />
                <p className="text-xs text-muted-foreground mt-1">Used in: HouseInsurance dropdowns & amount fields</p>
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

              <SubSection title="Custom Select (Flow-style)">
                <select className="w-full rounded-xl border-2 border-input bg-white px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none">
                  <option value="">Select building type...</option>
                  <option value="a">Detached house</option>
                  <option value="b">Apartment</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">Used in: HouseInsurance — native select with custom styling</p>
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

              <SubSection title="Custom Toggle Switch (Flow-style)">
                <div className="flex items-center justify-between max-w-xs">
                  <span className="text-sm font-medium text-foreground">High-value items</span>
                  <button
                    onClick={() => setDemoSwitch(!demoSwitch)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                      demoSwitch ? "bg-primary" : "bg-input"
                    }`}
                  >
                    <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      demoSwitch ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Used in: HouseInsurance toggle rows with conditional amount input</p>
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
          <Section title="Cards" id="cards">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>Default shadcn card with header and content.</CardDescription>
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
                <h4 className="text-base font-semibold text-foreground mb-1">Selected Card State</h4>
                <p className="text-sm text-muted-foreground">border-primary · bg-primary/10 · shadow-sm</p>
              </div>

              <div className="rounded-3xl border border-border p-6 shadow-sm bg-card">
                <h4 className="text-base font-semibold text-foreground mb-1">Question Container</h4>
                <p className="text-sm text-muted-foreground">rounded-3xl · shadow-sm · 1px border</p>
              </div>

              <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-4">
                <h4 className="text-base font-semibold text-foreground mb-1">Form Card (Flow-style)</h4>
                <p className="text-sm text-muted-foreground">rounded-3xl · border-2 border-input · bg-white</p>
                <p className="text-xs text-muted-foreground">Used in: StepStartDate, StepPhoneVerification</p>
              </div>

              <div className="border border-border rounded-2xl bg-card p-6 shadow-sm">
                <h4 className="text-base font-semibold text-foreground mb-1">Section Card (HouseInsurance)</h4>
                <p className="text-sm text-muted-foreground">rounded-2xl · 1px border · bg-card · shadow-sm</p>
              </div>
            </div>
          </Section>

          {/* ── 7. FEEDBACK & STATUS ── */}
          <Section title="Feedback & Status" id="feedback">
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

              <SubSection title="Offer Badge (hardcoded)">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">Best and cheapest choice</span>
                  <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">The most popular choice</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">⚠️ Uses hardcoded bg-blue-50 text-blue-600 — consider tokenizing</p>
              </SubSection>

              <SubSection title="Success Feedback">
                <div className="bg-success/10 border border-success/20 rounded-xl px-4 py-3">
                  <p className="text-sm text-success font-medium">
                    ✓ Great! We'll use these details. You can always edit them later.
                  </p>
                </div>
              </SubSection>

              <SubSection title="Neutral Feedback">
                <div className="bg-muted rounded-xl px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    No problem — you'll be able to enter your details manually.
                  </p>
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

              <SubSection title="Verification Checklist">
                <div className="space-y-2">
                  {["Stone/concrete exterior walls", "Sloping roof without thatch", "Kitchen less than 10 years old"].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Used in: HouseInsurance preset verification</p>
              </SubSection>
            </div>
          </Section>

          {/* ── 8. TABS ── */}
          <Section title="Tabs" id="tabs">
            <SubSection title="shadcn Tabs">
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
            </SubSection>

            <SubSection title="Product Tabs (1px border, no shadow)">
              <div className="flex gap-2 border-b border-tab-border pb-2 max-w-md">
                {["Liability", "Home", "Travel"].map((tab, i) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      i === 0
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Used in: StepPreferences product tabs — 1px bottom stroke (#D5D5D5)</p>
            </SubSection>
          </Section>

          {/* ── 9. ACCORDION ── */}
          <Section title="Accordion" id="accordion">
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
          <Section title="Dialog" id="dialog">
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

          {/* ── 11. SEGMENTED CONTROLS ── */}
          <Section title="Segmented Controls" id="selectors">
            <SubSection title="Segmented Buttons (single select)">
              <div className="flex gap-2">
                {["Option A", "Option B", "Option C"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDemoSegmented(opt)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all text-left ${
                      demoSegmented === opt
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card text-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Used in: HouseInsurance role/material selectors — rounded-xl, border-2</p>
            </SubSection>

            <SubSection title="Chip Selectors (multi-select)">
              <div className="flex flex-wrap gap-2">
                {["Chip 1", "Chip 2", "Chip 3"].map((chip) => {
                  const isActive = demoChip.includes(chip);
                  return (
                    <button
                      key={chip}
                      onClick={() => setDemoChip(isActive ? demoChip.filter(c => c !== chip) : [...demoChip, chip])}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-all ${
                        isActive
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-card text-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {isActive && <Check className="w-3.5 h-3.5 inline mr-1" />}
                      {chip}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Used in: HouseInsurance usage selector — rounded-full, multi-select</p>
            </SubSection>

            <SubSection title="Insurance Pill (read-only)">
              <div className="flex gap-2">
                {[
                  { icon: Home, label: "Home" },
                  { icon: Car, label: "Car" },
                  { icon: Scale, label: "Legal" },
                ].map((ins) => (
                  <div key={ins.label} className="flex items-center gap-2 border border-border rounded-full px-4 py-2">
                    <ins.icon className="w-5 h-5 text-foreground" />
                    <span className="text-sm font-semibold text-foreground">{ins.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Used in: StepReady — read-only selected insurance pills</p>
            </SubSection>

            <SubSection title="Yes / No Buttons">
              <div className="flex gap-3">
                <button className="px-5 py-3.5 rounded-xl border-2 border-primary bg-primary/10 text-sm font-semibold text-foreground">
                  ✓ Yes, correct
                </button>
                <button className="px-5 py-3.5 rounded-xl border-2 border-border text-sm font-semibold text-foreground hover:border-muted-foreground">
                  ✗ No, I'll fill it in
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Used in: HouseInsurance preset verification</p>
            </SubSection>
          </Section>

          {/* ── 12. OVERLAYS & BACKDROPS ── */}
          <Section title="Overlays & Backdrops" id="overlays">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative h-32 rounded-xl border border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">bg-black/80</span>
                </div>
                <p className="absolute bottom-1 left-2 text-[10px] text-muted-foreground">Dialog/Drawer overlay</p>
              </div>

              <div className="relative h-32 rounded-xl border border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">bg-black/40</span>
                </div>
                <p className="absolute bottom-1 left-2 text-[10px] text-muted-foreground">Modal backdrop</p>
              </div>

              <div className="relative h-32 rounded-xl border border-border overflow-hidden">
                <div className="absolute inset-0 bg-card flex items-center justify-center">
                  <div className="bg-card border border-border rounded-2xl shadow-2xl px-4 py-3">
                    <span className="text-xs font-medium text-foreground">shadow-2xl modal</span>
                  </div>
                </div>
                <p className="absolute bottom-1 left-2 text-[10px] text-muted-foreground">Help modal card</p>
              </div>
            </div>
          </Section>

          {/* ── 13. CUSTOM COMPONENTS ── */}
          <Section title="Custom Components" id="custom">
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

            <SubSection title="Sticky Footer (Back variant)">
              <div className="relative rounded-3xl border border-border bg-card px-6 py-4 flex items-center justify-between shadow-lg max-w-xl">
                <button className="inline-flex items-center gap-2 text-foreground px-4 py-3 rounded-full font-medium text-base hover:bg-muted transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  className="inline-flex items-center gap-2 text-success-foreground px-7 py-3 rounded-full font-semibold text-base"
                  style={{
                    background: "linear-gradient(180deg, hsl(121 72% 48%) 0%, hsl(121 72% 38%) 100%)",
                    boxShadow: "0 4px 12px -2px hsla(121, 72%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)",
                  }}
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">StickyFooter with Back button when showSavings=false</p>
            </SubSection>

            <SubSection title="Flow Switcher (pattern)">
              <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 shadow-lg text-sm font-medium text-foreground w-fit">
                <span className="w-2 h-2 rounded-full bg-success" />
                Flow A — Quick Scan
                <ChevronDown className="w-4 h-4" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">FlowSwitcher — fixed top-right dropdown for switching test flows</p>
            </SubSection>

            <SubSection title="Taco Chat Bubble">
              <div className="flex items-start gap-3 max-w-md">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-lg">🌮</span>
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-md px-5 py-3">
                  <p className="text-base text-foreground">
                    Based on your address, I've found some details about your home. Can you confirm this?
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Used in: HouseInsurance — rounded-2xl rounded-tl-md</p>
            </SubSection>

            <SubSection title="Ask Taco Float">
              <div className="bg-card border border-border rounded-xl p-4 shadow-lg w-56">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg">🌮</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Ask Taco</p>
                    <p className="text-xs text-muted-foreground">I'm ready to assist you</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 border border-border rounded-full py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <MessageCircle className="w-4 h-4 text-success" />
                  Chat via WhatsApp
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">AskTacoFloat — fixed bottom-left helper widget</p>
            </SubSection>

            <SubSection title="Product Selection Card (StepOne)">
              <div className="flex gap-3 max-w-md">
                <button className="flex items-center gap-3 px-5 py-4 rounded-2xl border-2 border-primary bg-primary/10 shadow-md text-left flex-1">
                  <Home className="w-6 h-6 text-foreground" />
                  <div>
                    <span className="text-sm font-semibold text-foreground block">Home</span>
                    <span className="text-xs text-muted-foreground">Protect your property</span>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-5 py-4 rounded-2xl border-2 border-border bg-card hover:shadow-md text-left flex-1 transition-shadow">
                  <Car className="w-6 h-6 text-foreground" />
                  <div>
                    <span className="text-sm font-semibold text-foreground block">Car</span>
                    <span className="text-xs text-muted-foreground">Vehicle coverage</span>
                  </div>
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Used in: StepOne — selected uses border-primary + bg-primary/10 + shadow-md</p>
            </SubSection>
          </Section>

          {/* ── 14. ICONS ── */}
          <Section title="Icons (Lucide)" id="icons">
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

          {/* ── 15. ANIMATIONS ── */}
          <Section title="Animations" id="animations">
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
              <div className="flex items-center gap-3">
                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">scale-in</code>
                <span>0.5s ease-out — used in StepSuccess checkmark</span>
              </div>
            </div>
          </Section>

        </div>
      </ScrollArea>
    </div>
  );
};

export default DesignSystem;
