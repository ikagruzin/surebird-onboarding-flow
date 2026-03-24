import React, { useState } from "react";
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
import { SelectionCard } from "@/components/ui/selection-card";
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
  { name: "--background", label: "Background", cssVar: "0 0% 98%", hex: "#FAFAFA", brand: "Neutral 50" },
  { name: "--foreground", label: "Foreground", cssVar: "220 20% 12%", hex: "#181D27", brand: "Neutral 900" },
  { name: "--primary", label: "Primary", cssVar: "209 100% 51%", hex: "#0385FF", brand: "Blue 500" },
  { name: "--primary-foreground", label: "Primary FG", cssVar: "0 0% 100%", hex: "#FFFFFF", brand: "White" },
  { name: "--secondary", label: "Secondary", cssVar: "0 0% 96%", hex: "#F5F5F5", brand: "Neutral 100" },
  { name: "--secondary-foreground", label: "Secondary FG", cssVar: "220 20% 12%", hex: "#181D27", brand: "Neutral 900" },
  { name: "--muted", label: "Muted", cssVar: "0 0% 96%", hex: "#F5F5F5", brand: "Neutral 100" },
  { name: "--muted-foreground", label: "Muted FG", cssVar: "224 5% 47%", hex: "#717680", brand: "Neutral 500" },
  { name: "--accent", label: "Accent (Green)", cssVar: "121 66% 42%", hex: "#25B327", brand: "Light Green 500" },
  { name: "--accent-foreground", label: "Accent FG", cssVar: "0 0% 100%", hex: "#FFFFFF", brand: "White" },
  { name: "--destructive", label: "Destructive", cssVar: "4 86% 58%", hex: "#F04438", brand: "Red 500" },
  { name: "--destructive-foreground", label: "Destructive FG", cssVar: "0 0% 100%", hex: "#FFFFFF", brand: "White" },
  { name: "--success", label: "Success", cssVar: "121 66% 42%", hex: "#25B327", brand: "Light Green 500" },
  { name: "--success-foreground", label: "Success FG", cssVar: "0 0% 100%", hex: "#FFFFFF", brand: "White" },
  { name: "--border", label: "Border", cssVar: "220 5% 92%", hex: "#E9EAEB", brand: "Neutral 200" },
  { name: "--input", label: "Input", cssVar: "220 5% 92%", hex: "#E9EAEB", brand: "Neutral 200" },
  { name: "--ring", label: "Ring", cssVar: "209 100% 51%", hex: "#0385FF", brand: "Blue 500" },
  { name: "--card", label: "Card", cssVar: "0 0% 100%", hex: "#FFFFFF", brand: "White" },
  { name: "--card-foreground", label: "Card FG", cssVar: "220 20% 12%", hex: "#181D27", brand: "Neutral 900" },
  { name: "--popover", label: "Popover", cssVar: "0 0% 100%", hex: "#FFFFFF", brand: "White" },
  { name: "--popover-foreground", label: "Popover FG", cssVar: "220 20% 12%", hex: "#181D27", brand: "Neutral 900" },
];




const HARDCODED_COLORS: { name: string; label: string; color: string; hex: string; usage: string }[] = [];

/* ── Color Audit: full brand palette ── */
const COLOR_AUDIT = [
  { group: "Base", colors: [
    { hex: "#FFFFFF", label: "White" },
    { hex: "#000000", label: "Black" },
  ]},
  { group: "Blue", colors: [
    { hex: "#F0F8FF", label: "25" },
    { hex: "#EBF5FF", label: "50" },
    { hex: "#CCE7FF", label: "100" },
    { hex: "#99CFFF", label: "200" },
    { hex: "#66B7FF", label: "300" },
    { hex: "#339EFF", label: "400" },
    { hex: "#0385FF", label: "500" },
    { hex: "#0177E5", label: "600" },
    { hex: "#0160B8", label: "700" },
    { hex: "#01498A", label: "800" },
    { hex: "#01325D", label: "900" },
    { hex: "#001B30", label: "950" },
  ]},
  { group: "Neutral", colors: [
    { hex: "#FDFDFD", label: "25" },
    { hex: "#FAFAFA", label: "50" },
    { hex: "#F5F5F5", label: "100" },
    { hex: "#E9EAEB", label: "200" },
    { hex: "#D5D7DA", label: "300" },
    { hex: "#A4A7AE", label: "400" },
    { hex: "#717680", label: "500" },
    { hex: "#535862", label: "600" },
    { hex: "#414651", label: "700" },
    { hex: "#252B37", label: "800" },
    { hex: "#181D27", label: "900" },
    { hex: "#0A0D12", label: "950" },
  ]},
  { group: "Red / Error", colors: [
    { hex: "#FFFBFA", label: "25" },
    { hex: "#FEF3F2", label: "50" },
    { hex: "#FEE4E2", label: "100" },
    { hex: "#FECDCA", label: "200" },
    { hex: "#FDA29B", label: "300" },
    { hex: "#F97066", label: "400" },
    { hex: "#F04438", label: "500" },
    { hex: "#D92D20", label: "600" },
    { hex: "#B42318", label: "700" },
    { hex: "#912018", label: "800" },
    { hex: "#7A271A", label: "900" },
    { hex: "#55160C", label: "950" },
  ]},
  { group: "Green", colors: [
    { hex: "#F6FEF9", label: "25" },
    { hex: "#ECFDF3", label: "50" },
    { hex: "#DCFAE6", label: "100" },
    { hex: "#A9EFC5", label: "200" },
    { hex: "#75E0A7", label: "300" },
    { hex: "#47CD89", label: "400" },
    { hex: "#17B26A", label: "500" },
    { hex: "#079455", label: "600" },
    { hex: "#067647", label: "700" },
    { hex: "#085D3A", label: "800" },
    { hex: "#074D31", label: "900" },
    { hex: "#053321", label: "950" },
  ]},
  { group: "Light Green", colors: [
    { hex: "#F2FEF3", label: "25" },
    { hex: "#E5FDE7", label: "50" },
    { hex: "#C8FBCD", label: "100" },
    { hex: "#96F79E", label: "200" },
    { hex: "#64F370", label: "300" },
    { hex: "#3DEF4B", label: "400" },
    { hex: "#25B327", label: "500" },
    { hex: "#1E8F1F", label: "600" },
    { hex: "#166B17", label: "700" },
    { hex: "#0F4810", label: "800" },
    { hex: "#0A3A0A", label: "900" },
    { hex: "#052405", label: "950" },
  ]},
  { group: "Orange", colors: [
    { hex: "#FEFBF5", label: "25" },
    { hex: "#FEF6EB", label: "50" },
    { hex: "#FDEED7", label: "100" },
    { hex: "#F8DDAF", label: "200" },
    { hex: "#F9CB86", label: "300" },
    { hex: "#F7BA5E", label: "400" },
    { hex: "#F5A938", label: "500" },
    { hex: "#C4872B", label: "600" },
    { hex: "#936520", label: "700" },
    { hex: "#624416", label: "800" },
    { hex: "#31220B", label: "900" },
    { hex: "#251908", label: "950" },
  ]},
  { group: "Purple", colors: [
    { hex: "#F6F5FE", label: "25" },
    { hex: "#EEEBFD", label: "50" },
    { hex: "#DDD8FB", label: "100" },
    { hex: "#B8B1F6", label: "200" },
    { hex: "#9989F2", label: "300" },
    { hex: "#7762ED", label: "400" },
    { hex: "#553BE9", label: "500" },
    { hex: "#442FBA", label: "600" },
    { hex: "#33238C", label: "700" },
    { hex: "#22185D", label: "800" },
    { hex: "#110C2F", label: "900" },
    { hex: "#0D0923", label: "950" },
  ]},
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
  const [demoSelection, setDemoSelection] = useState("radio-demo");

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
                        <code className="text-2xs text-muted-foreground font-mono">{token.name}</code>
                        <code className="text-2xs text-muted-foreground font-mono">hsl({token.cssVar})</code>
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
                        <code className="text-2xs text-muted-foreground font-mono">{o.label}</code>
                      </div>
                    ))}
                  </div>
                </SubSection>
              </TabsContent>

              <TabsContent value="audit">
                <p className="text-sm text-muted-foreground mb-6">
                  Full brand color palette — source of truth for all design decisions.
                </p>
                {COLOR_AUDIT.map((group) => (
                  <div key={group.group} className="mb-6">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{group.group}</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                      {group.colors.map((c) => (
                        <div key={c.hex + c.label} className="flex flex-col items-center gap-1">
                          <div
                            className="w-full aspect-square rounded-lg border border-border"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-2xs font-medium text-foreground text-center leading-tight">{c.label}</span>
                          <code className="text-2xs text-muted-foreground font-mono">{c.hex}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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

            <SubSection title="Type Scale Reference">
              <div className="border border-border rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[180px_60px_80px_1fr_120px_120px] bg-muted px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Token</span>
                  <span>Size</span>
                  <span>Line H.</span>
                  <span>Preview</span>
                  <span>Tailwind</span>
                  <span>Weight</span>
                </div>
                {/* Rows */}
                {[
                  { token: "H1", size: "36px", lh: "40px", tw: "text-4xl", leading: "leading-10", weight: "font-bold" },
                  { token: "H2", size: "30px", lh: "36px", tw: "text-3xl", leading: "leading-9", weight: "font-bold" },
                  { token: "H3", size: "24px", lh: "32px", tw: "text-2xl", leading: "leading-8", weight: "font-semibold" },
                  { token: "H4", size: "20px", lh: "28px", tw: "text-xl", leading: "leading-7", weight: "font-semibold" },
                  { token: "H5", size: "18px", lh: "28px", tw: "text-lg", leading: "leading-7", weight: "font-medium" },
                  { token: "P Large Normal", size: "18px", lh: "28px", tw: "text-lg", leading: "leading-7", weight: "font-normal" },
                  { token: "P Large Medium", size: "18px", lh: "28px", tw: "text-lg", leading: "leading-7", weight: "font-medium" },
                  { token: "P Large SemiBold", size: "18px", lh: "28px", tw: "text-lg", leading: "leading-7", weight: "font-semibold" },
                  { token: "P Base Normal", size: "16px", lh: "24px", tw: "text-base", leading: "leading-6", weight: "font-normal" },
                  { token: "P Base Medium", size: "16px", lh: "24px", tw: "text-base", leading: "leading-6", weight: "font-medium" },
                  { token: "P Base SemiBold", size: "16px", lh: "24px", tw: "text-base", leading: "leading-6", weight: "font-semibold" },
                  { token: "P Small Normal", size: "14px", lh: "20px", tw: "text-sm", leading: "leading-5", weight: "font-normal" },
                  { token: "P Small Medium", size: "14px", lh: "20px", tw: "text-sm", leading: "leading-5", weight: "font-medium" },
                  { token: "P Small SemiBold", size: "14px", lh: "20px", tw: "text-sm", leading: "leading-5", weight: "font-semibold" },
                  { token: "P XSmall Normal", size: "12px", lh: "16px", tw: "text-xs", leading: "leading-4", weight: "font-normal" },
                  { token: "P XSmall Medium", size: "12px", lh: "16px", tw: "text-xs", leading: "leading-4", weight: "font-medium" },
                  { token: "P XSmall SemiBold", size: "12px", lh: "16px", tw: "text-xs", leading: "leading-4", weight: "font-semibold" },
                  { token: "Button", size: "14px", lh: "20px", tw: "text-sm", leading: "leading-5", weight: "font-medium" },
                ].map((row, i) => (
                  <div
                    key={row.token}
                    className={`grid grid-cols-[180px_60px_80px_1fr_120px_120px] items-center px-4 py-3 ${i % 2 === 0 ? "bg-card" : "bg-muted/50"} border-t border-border`}
                  >
                    <span className="text-sm font-medium text-foreground">{row.token}</span>
                    <span className="text-xs text-muted-foreground">{row.size}</span>
                    <span className="text-xs text-muted-foreground">{row.lh}</span>
                    <span className={`${row.tw} ${row.leading} ${row.weight} text-foreground truncate pr-4`}>Ag</span>
                    <code className="text-xs text-muted-foreground font-mono">{row.tw}</code>
                    <code className="text-xs text-muted-foreground font-mono">{row.weight}</code>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                All sizes and line-heights use standard Tailwind utilities — no custom tokens required.
              </p>
            </SubSection>

            <SubSection title="Question Label Convention">
              <p className="text-base font-semibold text-foreground mb-1">What is your name?</p>
              <p className="text-xs text-muted-foreground">Questions use <code className="bg-muted px-1 rounded text-2xs">text-base font-semibold</code> — 48px gap between header and input.</p>
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
                    <code className="text-2xs text-muted-foreground">{r.label}</code>
                    <code className="text-2xs text-muted-foreground">{r.val}</code>
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

            <SubSection title="All Variants">
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="outline-primary">Outline Primary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="destructive-outline">Destructive Outline</Button>
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
                <Button variant="outline-primary">Enabled</Button>
                <Button variant="outline-primary" disabled>Disabled</Button>
                <Button variant="secondary">Enabled</Button>
                <Button variant="secondary" disabled>Disabled</Button>
              </div>
            </SubSection>

            <SubSection title="With Icons">
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="outline-primary"><CheckCircle className="w-4 h-4" /> Verify with my Bank</Button>
                <Button variant="default"><Check className="w-4 h-4" /> Simulate Verification</Button>
                <Button variant="destructive-outline"><X className="w-4 h-4" /> Simulate Failure</Button>
                <Button variant="secondary">Next step <ChevronRight className="w-4 h-4" /></Button>
                <Button variant="ghost"><ChevronLeft className="w-4 h-4" /> Back</Button>
                <Button variant="outline"><Lock className="w-4 h-4" /> Lock discount for 24h</Button>
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
              <p className="text-xs text-muted-foreground mt-2">Used in: StickyFooter, StepSuccess — Green 3D gradient with inset highlight</p>
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
              <p className="text-xs text-muted-foreground mt-2">Active state inverts fg/bg — used for tab-style toggles</p>
            </SubSection>

            <Separator className="my-6" />

            <SubSection title="Selection Cards">
              <div className="flex items-center gap-4">
                <SelectionCard
                  label="Radio"
                  indicator="radio"
                  selected={demoSelection === "radio-demo"}
                  onClick={() => setDemoSelection(demoSelection === "radio-demo" ? "" : "radio-demo")}
                />
                <SelectionCard
                  label="Checkbox"
                  indicator="checkbox"
                  selected={demoSelection === "checkbox-demo"}
                  onClick={() => setDemoSelection(demoSelection === "checkbox-demo" ? "" : "checkbox-demo")}
                />
                <SelectionCard
                  label="None"
                  indicator="none"
                  selected={demoSelection === "none-demo"}
                  onClick={() => setDemoSelection(demoSelection === "none-demo" ? "" : "none-demo")}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Three indicator modes: <code className="bg-muted px-1 rounded text-2xs">radio</code>, <code className="bg-muted px-1 rounded text-2xs">checkbox</code>, <code className="bg-muted px-1 rounded text-2xs">none</code>
              </p>
            </SubSection>

            <Separator className="my-6" />

            <SubSection title="Variant × Size × State Reference Matrix">
              <p className="text-xs text-muted-foreground mb-4">Every variant shown across all sizes in enabled and disabled states. Hover over buttons to preview hover styles.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left px-4 py-2 font-semibold text-foreground sticky left-0 bg-muted z-10 min-w-28">Variant</th>
                      {(["sm", "default", "lg", "icon"] as const).map((s) => (
                        <th key={s} colSpan={2} className="text-center px-4 py-2 font-semibold text-foreground">{s}</th>
                      ))}
                    </tr>
                    <tr className="bg-muted/60">
                      <th className="sticky left-0 bg-muted/60 z-10" />
                      {(["sm", "default", "lg", "icon"] as const).map((s) => (
                        <React.Fragment key={s}>
                          <th className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Enabled</th>
                          <th className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Disabled</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(["default", "secondary", "outline", "outline-primary", "ghost", "destructive", "destructive-outline", "link"] as const).map((v) => (
                      <tr key={v} className="border-t border-border">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground sticky left-0 bg-card z-10">{v}</td>
                        {(["sm", "default", "lg", "icon"] as const).map((s) => (
                          <React.Fragment key={s}>
                            <td className="px-3 py-3 text-center">
                              <Button variant={v} size={s}>
                                {s === "icon" ? <Plus className="w-4 h-4" /> : v}
                              </Button>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <Button variant={v} size={s} disabled>
                                {s === "icon" ? <Plus className="w-4 h-4" /> : v}
                              </Button>
                            </td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

              <SubSection title="Offer Badge (tokenized)">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/5 text-primary text-xs font-medium px-2.5 py-1 rounded-full">Best and cheapest choice</span>
                  <span className="bg-primary/5 text-primary text-xs font-medium px-2.5 py-1 rounded-full">The most popular choice</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">✓ Uses bg-primary/5 text-primary</p>
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
                <p className="absolute bottom-1 left-2 text-2xs text-muted-foreground">Dialog/Drawer overlay</p>
              </div>

              <div className="relative h-32 rounded-xl border border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">bg-black/40</span>
                </div>
                <p className="absolute bottom-1 left-2 text-2xs text-muted-foreground">Modal backdrop</p>
              </div>

              <div className="relative h-32 rounded-xl border border-border overflow-hidden">
                <div className="absolute inset-0 bg-card flex items-center justify-center">
                  <div className="bg-card border border-border rounded-2xl shadow-2xl px-4 py-3">
                    <span className="text-xs font-medium text-foreground">shadow-2xl modal</span>
                  </div>
                </div>
                <p className="absolute bottom-1 left-2 text-2xs text-muted-foreground">Help modal card</p>
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
                  <span className="text-2xs text-muted-foreground text-center leading-tight">{name}</span>
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
