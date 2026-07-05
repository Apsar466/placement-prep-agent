import { motion } from 'framer-motion';

const TimelineCard = ({ week, title, tasks, isCompleted }) => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="flex gap-4"
    >
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full border-2 ${isCompleted ? 'bg-accent-green border-accent-green' : 'border-white/30'}`} />
        <div className="w-0.5 flex-1 bg-white/10 mt-2" />
      </div>
      <div className="pb-8">
        <p className="text-xs text-accent-blue font-mono mb-1">WEEK {week}</p>
        <h4 className="text-white font-heading mb-2">{title}</h4>
        <ul className="text-white/50 text-sm space-y-1">
          {tasks.map((task, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              {task}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default TimelineCard;