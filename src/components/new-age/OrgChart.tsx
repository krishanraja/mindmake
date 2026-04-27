import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Handle,
  Position,
  type NodeProps,
  type NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Sparkles, Star } from "lucide-react";
import {
  traditionalChart,
  newAgeChart,
  nodeVariantClasses,
  type ChartState,
  type OrgNode,
  type OrgNodeData,
} from "./orgChartData";
import { DecisionPromptSheet } from "./DecisionPromptSheet";
import { OrgChartMobile } from "./OrgChartMobile";
import { useIsMobile } from "@/hooks/use-mobile";

const trackEvent = (name: string, props?: Record<string, string>) => {
  try {
    (window as unknown as { plausible?: (e: string, o?: object) => void }).plausible?.(
      name,
      props ? { props } : undefined
    );
  } catch {
    /* analytics optional */
  }
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
};

// Custom node renderer — receives data via ReactFlow's NodeProps
const OrgNodeCard = ({ data }: NodeProps<OrgNodeData>) => {
  const { label, subtitle, kind, featured, decisionPrompt } = data;
  const clickable = Boolean(decisionPrompt);

  const base =
    "relative px-4 py-3 rounded-xl border transition-all duration-200 shadow-sm w-[176px] select-none text-center";
  const variant = nodeVariantClasses(kind);

  const hover = clickable
    ? "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-mint/30 cursor-pointer"
    : "";

  const Icon = kind === "agent" ? Bot : kind === "hybrid" ? Sparkles : User;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-mint/60 !border-0 !w-2 !h-2"
      />
      <motion.div
        layout
        initial={false}
        className={`${base} ${variant} ${hover}`}
      >
        {featured && (
          <motion.span
            className="absolute -top-2 -right-2 inline-flex items-center gap-0.5 bg-mint text-ink px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-ink/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          >
            <Star className="w-2.5 h-2.5 fill-ink" />
            Featured
          </motion.span>
        )}
        <div className="flex items-center justify-center gap-2 mb-1">
          <Icon className="w-3.5 h-3.5 opacity-80" />
          <span className="font-bold text-sm leading-tight">{label}</span>
        </div>
        {subtitle && (
          <div className="text-[11px] opacity-75 leading-tight">{subtitle}</div>
        )}
        {clickable && (
          <div className="text-[10px] mt-1.5 uppercase tracking-wider opacity-60">
            Click for decision
          </div>
        )}
      </motion.div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-mint/60 !border-0 !w-2 !h-2"
      />
    </>
  );
};

const nodeTypes = { org: OrgNodeCard };

const defaultEdgeOptions = {
  animated: false,
  style: {
    stroke: "hsl(158 82% 73% / 0.5)",
    strokeWidth: 1.5,
  },
};

interface OrgChartProps {
  className?: string;
}

export const OrgChart = ({ className }: OrgChartProps) => {
  const [state, setState] = useState<ChartState>("traditional");
  const [hasAutoToggled, setHasAutoToggled] = useState(false);
  const [selectedNode, setSelectedNode] = useState<OrgNodeData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Auto-toggle to new-age once after mount to reveal the payoff
  useEffect(() => {
    if (hasAutoToggled || reducedMotion) return;
    const t = setTimeout(() => {
      setState("new-age");
      setHasAutoToggled(true);
    }, 2200);
    return () => clearTimeout(t);
  }, [hasAutoToggled, reducedMotion]);

  const chart = state === "traditional" ? traditionalChart : newAgeChart;

  const openDecision = useCallback(
    (data: OrgNodeData, nodeId: string) => {
      if (!data.decisionPrompt) return;
      setSelectedNode(data);
      setSheetOpen(true);
      trackEvent("chart_node_clicked", { node: nodeId });
    },
    []
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => openDecision(node.data as OrgNodeData, node.id),
    [openDecision]
  );

  const handleToggle = (next: ChartState) => {
    if (next === state) return;
    setState(next);
    setHasAutoToggled(true);
    trackEvent("chart_toggle_flipped", { to: next });
  };

  // Memoize to avoid remount warnings on ReactFlow
  const nodes = useMemo(() => chart.nodes as OrgNode[], [chart]);
  const edges = useMemo(() => chart.edges, [chart]);

  return (
    <div className={className}>
      {/* Toggle */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="inline-flex items-center rounded-full border border-border bg-background p-1 shadow-sm">
          <button
            type="button"
            onClick={() => handleToggle("traditional")}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
              state === "traditional"
                ? "bg-ink text-white dark:bg-white dark:text-ink"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Traditional
          </button>
          <button
            type="button"
            onClick={() => handleToggle("new-age")}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
              state === "new-age"
                ? "bg-mint text-ink"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            New Age
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Click any node to see the decision a leader has to make about it.
        </p>
      </div>

      {/* Chart */}
      {isMobile ? (
        <OrgChartMobile
          state={state}
          reducedMotion={reducedMotion}
          onNodeSelect={openDecision}
        />
      ) : (
        <div className="relative rounded-2xl border border-border/60 bg-background overflow-hidden h-[480px] md:h-[560px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.5 }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                onNodeClick={onNodeClick}
                fitView
                fitViewOptions={{ padding: 0.2, duration: reducedMotion ? 0 : 600 }}
                minZoom={0.3}
                maxZoom={1.4}
                proOptions={{ hideAttribution: true }}
                nodesDraggable={false}
                nodesConnectable={false}
                panOnScroll={false}
                zoomOnScroll={false}
                zoomOnPinch
                zoomOnDoubleClick={false}
                panOnDrag={false}
              >
                <Background gap={24} color="hsl(var(--border) / 0.5)" />
              </ReactFlow>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <DecisionPromptSheet open={sheetOpen} onOpenChange={setSheetOpen} data={selectedNode} />
    </div>
  );
};
