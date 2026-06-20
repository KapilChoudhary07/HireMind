import { motion } from "framer-motion";

const StatsCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        scale: 1.03,
      }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white"
    >
      <div className="flex justify-between">
        <div>
          <p className="text-slate-400">
            {title}
          </p>

          <h2 className="text-3xl font-bold">
            {value}
          </h2>
        </div>

        {icon}
      </div>
    </motion.div>
  );
};

export default StatsCard;