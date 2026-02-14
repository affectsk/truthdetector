import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  // Determine color based on score
  let color = "hsl(142 76% 36%)"; // Green
  let label = "Trustworthy";
  
  if (score < 50) {
    color = "hsl(0 84% 60%)"; // Red
    label = "Likely Propaganda";
  } else if (score < 80) {
    color = "hsl(38 92% 50%)"; // Amber
    label = "Verify Carefully";
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-card rounded-3xl shadow-lg border border-border/50">
      <div className="w-48 h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              <Cell key="cell-0" fill={color} cornerRadius={10} />
              <Cell key="cell-1" fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8">
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl font-extrabold"
            style={{ color }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1">Credibility</span>
        </div>
      </div>
      
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center -mt-6"
      >
        <h3 className="text-xl font-bold" style={{ color }}>{label}</h3>
        <p className="text-sm text-muted-foreground mt-2 px-4">
          Based on domain reputation, language analysis, and citation quality.
        </p>
      </motion.div>
    </div>
  );
}
