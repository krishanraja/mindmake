import { Fragment, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, Star, User } from "lucide-react";
import {
  traditionalChart,
  newAgeChart,
  nodeVariantClasses,
  type ChartState,
  type OrgNode,
  type OrgNodeData,
} from "./orgChartData";

interface OrgChartMobileProps {
  state: ChartState;
  reducedMotion: boolean;
  onNodeSelect: (data: OrgNodeData, nodeId: string) => void;
}

const iconForKind = (kind: OrgNodeData["kind"]) =>
  kind === "agent" ? Bot : kind === "hybrid" ? Sparkles : User;

interface CardProps {
  node: OrgNode;
  parentLabel?: string;
  onSelect: (data: OrgNodeData, nodeId: string) => void;
}

const Card = ({ node, parentLabel, onSelect }: CardProps) => {
  const { id, data } = node;
  const { label, subtitle, kind, featured, decisionPrompt } = data;
  const clickable = Boolean(decisionPrompt);
  const Icon = iconForKind(kind);
  const variant = nodeVariantClasses(kind);

  return (
    <motion.button
      layout
      type="button"
      onClick={clickable ? () => onSelect(data, id) : undefined}
      disabled={!clickable}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      className={`relative w-full text-left px-4 py-3 rounded-xl border shadow-sm select-none min-h-[64px] ${variant} ${
        clickable ? "cursor-pointer active:shadow-md active:shadow-mint/30" : "cursor-default"
      }`}
    >
      {featured && (
        <span className="absolute -top-2 -right-2 inline-flex items-center gap-0.5 bg-mint text-ink px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-ink/20">
          <Star className="w-2.5 h-2.5 fill-ink" />
          Featured
        </span>
      )}
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 opacity-80 shrink-0" />
        <span className="font-bold text-sm leading-tight">{label}</span>
      </div>
      {subtitle && (
        <div className="text-[11px] opacity-75 leading-tight mt-1">{subtitle}</div>
      )}
      {parentLabel && (
        <div className="text-[11px] opacity-65 leading-tight mt-1">↳ Reports to {parentLabel}</div>
      )}
      {clickable && (
        <div className="text-[10px] mt-1.5 uppercase tracking-wider opacity-60">
          Tap for decision
        </div>
      )}
    </motion.button>
  );
};

interface TierRowProps {
  tier: OrgNode[];
  tierIdx: number;
  parentLabelById: Map<string, string>;
  onNodeSelect: (data: OrgNodeData, nodeId: string) => void;
}

const TierRow = ({ tier, tierIdx, parentLabelById, onNodeSelect }: TierRowProps) => {
  const showParentLabel = tierIdx >= 2;

  // Tier 0: single root, centered, ~two-thirds width
  if (tierIdx === 0) {
    const node = tier[0];
    return (
      <div className="flex justify-center">
        <div className="w-2/3">
          <Card node={node} onSelect={onNodeSelect} />
        </div>
      </div>
    );
  }

  // Single non-root card: full width
  if (tier.length === 1) {
    const node = tier[0];
    return (
      <Card
        node={node}
        parentLabel={showParentLabel ? parentLabelById.get(node.id) : undefined}
        onSelect={onNodeSelect}
      />
    );
  }

  // ≥ 2 cards: 2-col grid; featured cards span full row;
  // last card on its own row when the count is odd.
  const lastIdx = tier.length - 1;
  const isOdd = tier.length % 2 === 1;

  return (
    <div className="grid grid-cols-2 gap-3">
      {tier.map((node, i) => {
        const featured = node.data.featured;
        const isLastOdd = isOdd && i === lastIdx;
        const wrapper = featured
          ? "col-span-2"
          : isLastOdd
          ? "col-span-2 mx-auto w-[calc(50%-0.375rem)]"
          : "";
        return (
          <div key={node.id} className={wrapper}>
            <Card
              node={node}
              parentLabel={showParentLabel ? parentLabelById.get(node.id) : undefined}
              onSelect={onNodeSelect}
            />
          </div>
        );
      })}
    </div>
  );
};

export const OrgChartMobile = ({
  state,
  reducedMotion,
  onNodeSelect,
}: OrgChartMobileProps) => {
  const chart = state === "traditional" ? traditionalChart : newAgeChart;

  // Group nodes by y-position (the data file already encodes hierarchy via y).
  // Within each tier, sort by x so reading order matches the desktop layout.
  const tiers = useMemo(() => {
    const groups = new Map<number, OrgNode[]>();
    for (const node of chart.nodes as OrgNode[]) {
      const y = node.position.y;
      if (!groups.has(y)) groups.set(y, []);
      groups.get(y)!.push(node);
    }
    return [...groups.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, nodes]) => nodes.slice().sort((a, b) => a.position.x - b.position.x));
  }, [chart]);

  // For tier ≥ 2 we surface "Reports to <parent>" inside each card so the
  // hierarchy is preserved when the visual edges are gone.
  const parentLabelById = useMemo(() => {
    const labelById = new Map(chart.nodes.map((n) => [n.id, n.data.label]));
    const m = new Map<string, string>();
    for (const edge of chart.edges) {
      if (m.has(edge.target)) continue;
      const parent = labelById.get(edge.source);
      if (parent) m.set(edge.target, parent);
    }
    return m;
  }, [chart]);

  return (
    <div className="rounded-2xl border border-border/60 bg-background p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.45 }}
          className="flex flex-col items-stretch gap-3"
        >
          {tiers.map((tier, tierIdx) => (
            <Fragment key={tierIdx}>
              <TierRow
                tier={tier}
                tierIdx={tierIdx}
                parentLabelById={parentLabelById}
                onNodeSelect={onNodeSelect}
              />
              {tierIdx < tiers.length - 1 && (
                <div className="mx-auto h-4 w-px bg-mint/40" aria-hidden />
              )}
            </Fragment>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
