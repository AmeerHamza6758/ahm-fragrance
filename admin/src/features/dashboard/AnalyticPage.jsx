import React, { useState, useEffect } from 'react'
import { dashboardApi } from "../../services/endpoints";
import Loader from "../../components/Loader";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import "../../styles/admin.css"

function AnalyticPage() {
  const [ledgerData, setLedgerData] = useState([]);
  const [summary, setSummary] = useState({ users: 0, revenue: 0, refunds: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ledgerRes, statsRes, graphsRes] = await Promise.all([
          dashboardApi.getLedger(),
          dashboardApi.getStats(),
          dashboardApi.getGraphs()
        ]);

        if (ledgerRes.data && ledgerRes.data.success) {
          setLedgerData(ledgerRes.data.data);
        }

        if (statsRes.data && statsRes.data.success && graphsRes.data && graphsRes.data.success) {
          // Calculate annual summary from graph data if needed, or use specific stats
          const totalRevenue = graphsRes.data.data.revenueVsRefunded.find(d => d.name === 'Revenue')?.value || 0;
          const totalRefunds = graphsRes.data.data.revenueVsRefunded.find(d => d.name === 'Refunded')?.value || 0;
          const totalUsers = graphsRes.data.data.usersPerMonth.reduce((acc, curr) => acc + (curr.users || 0), 0);

          setSummary({
            users: totalUsers,
            revenue: totalRevenue,
            refunds: totalRefunds
          });
        }
      } catch (err) {
        console.error("Failed to fetch analytic data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader text="Compiling financial history..." />;

  return (
    <div className='revenue-analytic'>
        <div className='revenue-header'>
            <p className='overview-text'>FINANCIAL OVERVIEW</p>
            <h1 className='revenue-heading'>Revenue Analytics Ledger</h1>
            <p className='revenue-subheading'>A detailed chronicle of fiscal performance, tracking the growth of our AHM Fragrance scent collection.</p>
        </div> 

        <div className='analytic-summary-card'>
            <div className='analytic-card'>
                <p>Total Community Members</p>
                <h2>{summary.users.toLocaleString()}</h2>
                <p>Global reach across all regions</p>
            </div>
            <div className='analytic-card'>
                <p>Total Revenue (Delivered)</p>
                <h2>PKR {summary.revenue.toLocaleString()}</h2>
                <p>Accumulated artisan sales</p>
            </div>
            <div className='analytic-card'>
                <p>Total Refunded Value</p>
                <h2 style={{color:" #BA1A1A"}}>PKR {summary.refunds.toLocaleString()}</h2>
                <p>{summary.revenue > 0 ? ((summary.refunds / summary.revenue) * 100).toFixed(1) : 0}% of gross revenue</p>
            </div>
        </div>

        <div className='analytic-visuals' style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '20px', 
            border: '1px solid #EBE7E4', 
            marginBottom: '2.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
            <h2 className='ledger-title' style={{ marginBottom: '1.5rem' }}>Monthly Performance Visualization</h2>
            <div style={{ height: '400px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ledgerData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#78716C', fontSize: 12 }} 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#78716C', fontSize: 12 }} 
                            tickFormatter={(value) => `PKR ${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                        />
                        <Tooltip 
                            cursor={{ fill: '#FDF9F5' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                        />
                        <Legend iconType="circle" />
                        <Bar 
                            dataKey="gross" 
                            name="Gross Revenue" 
                            fill="#EAE0D5" 
                            radius={[6, 6, 0, 0]} 
                            barSize={30} 
                        />
                        <Bar 
                            dataKey="net" 
                            name="Net Revenue" 
                            fill="#7e525c" 
                            radius={[6, 6, 0, 0]} 
                            barSize={30} 
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className='revenue-ledger'>
            <h2 className='ledger-title'>Monthly Revenue Ledger</h2>
            <div className='ledger-table'>
                <div className='ledger-table-header'>
                    <span>Month</span>
                    <span>Orders</span>
                    <span>Refunded</span>
                    <span>Delivered</span>
                    <span>Payment</span>
                    <span>Gross (PKR)</span>
                    <span>Refunds (PKR)</span>
                    <span>Net (PKR)</span> 
                </div> 

                {ledgerData.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                        No ledger data recorded yet.
                    </div>
                ) : (
                    ledgerData.map((item, index) => (
                        <div className='ledger-table-row' key={index}>
                           <span>{item.month} </span>
                           <span>{item.order} </span>
                           <span>{item.refunded} </span>
                           <span>{item.deliverd} </span>
                           <span className='paid-status'>PROCESSED</span>
                           <span>{(item.gross || 0).toLocaleString()} </span>
                           <span>{(item.refunds || 0).toLocaleString()} </span>
                           <span style={{ fontWeight: 600 }}>{(item.net || 0).toLocaleString()} </span>
                        </div>  
                    ))
                )}      
            </div>   
        </div>      
    </div>
  )
}

export default AnalyticPage
