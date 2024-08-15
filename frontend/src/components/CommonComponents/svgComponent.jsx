import { motion } from "framer-motion";

export const SVGComponent = ({ text }) => {
  const calculateTextWidth = (fontSize) => {
    return fontSize * text.length * 0.6;
  };

  const fontSize = 35;
  const textWidth = calculateTextWidth(fontSize);

  return (
    <svg width="600" height="60" viewBox="0 0 600 60">
      <defs>
        <path id="curvePath" d="M100,100 C200,20 400,20 500,100" />
      </defs>
      <motion.text
        x="50%"
        y="50%"
        fontSize={fontSize}
        fill="none"
        stroke="#062d44"
        strokeWidth="1.5"
        strokeDasharray={textWidth}
        strokeDashoffset={textWidth}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        textAnchor="middle"
        alignmentBaseline="middle"
        dominantBaseline="middle"
      >
        {text}
      </motion.text>
    </svg>
  );
};
