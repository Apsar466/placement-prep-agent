import PageTransition from '../components/layout/PageTransition';
import PlacementReadinessRing from '../components/dashboard/PlacementReadinessRing';
import FloatingMetricCard from '../components/dashboard/FloatingMetricCard';
import GlowingRadarChart from '../components/charts/GlowingRadarChart';
import { FileText, Brain, Mic, Building2 } from 'lucide-react';

const radarData = [
  { subject: 'DSA', score: 80 },
  { subject: 'System Design', score: 40 },
  { subject: 'CS Fundamentals', score: 90 },
  { subject: 'Communication', score: 75 },
  { subject: 'Projects', score: 85 },
];

const DashboardOS = () => {
  return (
    <PageTransition>
      <div className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">AI Placement Command Center</h1>
        <p className="text-white/40 mb-8">Real-time overview of your placement readiness.</p>

        {/* PRI Ring */}
        <div className="glass-panel p-8 mb-8 flex flex-col items-center">
          <PlacementReadinessRing score={84} />
          <div className="mt-4 text-center">
            <p className="text-white/50 text-sm">Current Target</p>
            <p className="text-xl font-heading text-white">Microsoft</p>
          </div>
        </div>

        {/* Tilt Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FloatingMetricCard title="Resume Score" value="92%" icon={FileText} badge="Excellent" />
          <FloatingMetricCard title="Skill Match" value="78%" icon={Brain} badge="Good" />
          <FloatingMetricCard title="Interview Avg" value="85%" icon={Mic} badge="Strong" />
          <FloatingMetricCard title="Company Match" value="90%" icon={Building2} badge="High" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 h-[300px]">
            <h3 className="text-white font-heading mb-4">Skill Distribution</h3>
            <GlowingRadarChart data={radarData} />
          </div>
          <div className="glass-panel p-6 h-[300px] flex items-center justify-center text-white/20">
            Progress Line Chart Placeholder
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardOS;