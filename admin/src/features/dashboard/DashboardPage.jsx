import { useState, useEffect } from "react";
import { dashboardApi } from "../../services/endpoints";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import Loader from "../../components/Loader";

const COLORS = ['#7e525c', '#4e4543', '#EAE0D5', '#FDF9F5'];

function DashboardPage() {
  const [statsData, setStatsData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, graphsRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getGraphs()
        ]);

        if (statsRes.data && statsRes.data.success) {
          setStatsData(statsRes.data);
        }
        if (graphsRes.data && graphsRes.data.success) {
          setGraphData(graphsRes.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader text="Orchestrating analytics..." />;

  const stats = [
    { title: "Total Products", value: String(statsData?.totalProducts || 0), subtitle: "Active botanical catalog" },
    { title: "Pending Orders", value: String(statsData?.totalPendingOrders || 0), subtitle: "Awaiting artisan confirmation" },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Stats Overview - Premium Cards */}
      <div className="dashboard-stats" style={{ 
        display: "flex", 
        flexDirection: "row", 
        gap: "1.5rem", 
        marginBottom: "2.5rem",
        flexWrap: "wrap"
      }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{ 
            flex: 1, 
            minWidth: "240px", 
            background: "white", 
            borderRadius: "12px", 
            border: "1px solid #EBE7E4", 
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
          }}>
            <div style={{ 
              backgroundColor: "#FDF9F5", 
              padding: "10px 16px", 
              borderBottom: "1px solid #EBE7E4",
              fontWeight: "700",
              color: "#7E525C",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              {stat.title}
            </div>
            <div style={{ padding: "16px" }}>
              <h3 style={{ fontSize: "1.75rem", margin: "0 0 4px 0", color: "#2D2726" }}>{stat.value}</h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#78716C" }}>{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Graphs */}
      <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        
        {/* Sales vs Returns - Donut Chart */}
        <DonutCard 
          title="Order Dynamics" 
          data={graphData?.salesVsReturns} 
          dataKey="count" 
          unit="Items"
          colors={COLORS}
        />

        {/* Revenue vs Refunded - Donut Chart */}
        <DonutCard 
          title="Capital Flow" 
          data={graphData?.revenueVsRefunded} 
          dataKey="value" 
          unit="PKR"
          colors={[COLORS[1], COLORS[0]]}
          isCurrency
        />

        {/* User Engagement - Donut Chart */}
        <DonutCard 
          title="Community Share" 
          data={graphData?.usersPerMonth} 
          dataKey="users" 
          unit="Users"
          colors={COLORS}
        />

      </div>
    </div>
  );
}

function DonutCard({ title, data, dataKey, unit, colors, isCurrency }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const totalValue = data?.reduce((acc, curr) => acc + curr[dataKey], 0) || 0;
  const displayValue = activeIndex === -1 
    ? (isCurrency ? `PKR ${(totalValue/1000).toFixed(1)}k` : totalValue)
    : (isCurrency ? `PKR ${(data[activeIndex][dataKey]/1000).toFixed(1)}k` : data[activeIndex][dataKey]);
  
  const displayLabel = activeIndex === -1 ? `Total ${unit}` : data[activeIndex].name;

  return (
    <div className="analytics-card glass-card" style={{ 
      background: 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(10px)',
      padding: '2rem', 
      borderRadius: '20px', 
      border: '1px solid rgba(237, 230, 225, 0.5)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      position: 'relative',
      boxShadow: '0 8px 32px rgba(126, 82, 92, 0.05)',
      transition: 'all 0.3s ease'
    }}>
      <h3 className="section-title-small" style={{ marginBottom: '1rem', color: '#7e525c', fontSize: '1.1rem', textAlign: 'center', fontWeight: 600 }}>{title}</h3>
      <div style={{ height: '280px', width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={95}
              paddingAngle={8}
              dataKey={dataKey}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                  style={{ 
                    outline: 'none', 
                    filter: activeIndex === index ? 'brightness(1.1) drop-shadow(0 0 8px rgba(126, 82, 92, 0.2))' : 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip isCurrency={isCurrency} />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Label */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', textAlign: 'center', pointerEvents: 'none', width: '140px' }}>
          <span style={{ fontSize: activeIndex === -1 ? '1.6rem' : '1.4rem', fontWeight: 700, color: '#7e525c', display: 'block', transition: 'all 0.2s ease' }}>
            {displayValue}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, display: 'block', marginTop: '2px' }}>
            {displayLabel}
          </span>
        </div>
      </div>
      <div className="custom-legend" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {data?.map((entry, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontSize: '0.8rem', 
            color: activeIndex === index ? '#7e525c' : '#4e4543',
            fontWeight: activeIndex === index ? 600 : 400,
            transition: 'all 0.2s ease',
            opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.5
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[index % colors.length] }}></div>
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, isCurrency }) => {
  if (active && payload && payload.length) {
    const value = isCurrency ? `PKR ${payload[0].value.toLocaleString()}` : payload[0].value;
    return (
      <div style={{ 
        background: '#fff', 
        padding: '10px 15px', 
        borderRadius: '12px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
        border: '1px solid #fdf9f5' 
      }}>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>{payload[0].name}</p>
        <p style={{ margin: 0, fontSize: '1rem', color: '#7e525c', fontWeight: 700 }}>{value}</p>
      </div>
    );
  }
  return null;
};

export default DashboardPage;