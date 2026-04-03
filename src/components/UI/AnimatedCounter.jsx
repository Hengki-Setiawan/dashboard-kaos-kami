import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useTransform, motion } from "framer-motion";
import { formatIDR, formatCompact } from "../../utils/constants";

export default function AnimatedCounter({ 
  value, 
  prefix = "", 
  suffix = "", 
  format = "standard", // "standard", "currency", "compact", "percent"
  duration = 2
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0
  });

  const displayValue = useTransform(springValue, (current) => {
    let rounded = Math.round(current);
    if (format === "currency") return formatIDR(rounded);
    if (format === "compact") return formatCompact(rounded);
    if (format === "compact_idr") {
      if (rounded >= 1000000) return 'Rp ' + (rounded / 1000000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + ' Jt';
      if (rounded >= 1000) return 'Rp ' + (rounded / 1000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + ' Rb';
      return formatIDR(rounded);
    }
    if (format === "percent") return `${current.toFixed(1)}%`;
    return rounded.toLocaleString('id-ID'); // standard format
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref} className="inline-block">
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}
