import { useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface ExpandableQuoteProps {
  shortQuote: string;
  fullQuote: string;
  author: string;
  title: string;
}

export const ExpandableQuote = ({
  shortQuote,
  fullQuote,
  author,
  title,
}: ExpandableQuoteProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="glass-card p-6 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: 1.01 }}
    >
      <Quote className="w-8 h-8 text-mint mb-4" />

      <p className="text-lg font-medium mb-4">
        &ldquo;{isExpanded ? fullQuote : shortQuote}&rdquo;
      </p>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>

        {!isExpanded && (
          <span className="text-xs text-mint">Click to read more</span>
        )}
      </div>
    </motion.div>
  );
};
