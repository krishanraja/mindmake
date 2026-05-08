import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ProductExpandCard,
  type ProductExpandCardData,
} from "@/components/ProductExpandCard";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

interface ProductExpandSectionProps {
  products: ProductExpandCardData[];
  initialExpandedId?: string;
}

const updateHashWithoutScroll = (hash: string | null) => {
  const url = hash
    ? `${window.location.pathname}${window.location.search}#${hash}`
    : `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", url);
};

const scrollToCard = (id: string) => {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 100);
};

export const ProductExpandSection = ({
  products,
  initialExpandedId,
}: ProductExpandSectionProps) => {
  const productIds = products.map((p) => p.id);

  const [expandedId, setExpandedId] = useState<string | null>(() => {
    if (initialExpandedId && productIds.includes(initialExpandedId)) {
      return initialExpandedId;
    }
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1);
      if (productIds.includes(hash)) return hash;
    }
    return null;
  });

  useEffect(() => {
    if (expandedId) scrollToCard(expandedId);
    // Run only on first mount to handle deep-link arrivals
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (productIds.includes(hash)) {
        setExpandedId(hash);
        scrollToCard(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [productIds]);

  const handleToggle = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      updateHashWithoutScroll(null);
    } else {
      setExpandedId(id);
      updateHashWithoutScroll(id);
    }
  };

  return (
    <div className="space-y-6">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          custom={i}
          variants={fadeUp}
        >
          <ProductExpandCard
            {...product}
            expanded={expandedId === product.id}
            onToggle={() => handleToggle(product.id)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductExpandSection;
