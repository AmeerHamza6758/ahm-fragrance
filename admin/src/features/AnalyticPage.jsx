import React from 'react'
import PageSection from "../components/PageSection";
import "../styles/admin.css"

const revenueData = [
    {
        month:"June 2024",
        order:"1890",
        refunded:"28",
        deliverd:"1820",
        status:"PAID",
        gross:"1,450,000",
        refunds:"21,000",
        net:"1,429,000"
    },
    {
        month:"May 2024",
        order:"1720",
        refunded:"19",
        deliverd:"1690",
        gross:"1,280,000",
        refunds:"14,500",
        net:"1,265,500"
    },
    {
        month:"April 2024",
        order:"1640",
        refunded:"24",
        deliverd:"1610",
        gross:"1,210,000",
        refunds:"18,200",
        net:"1,191,800"
    },
    {
        month:"March 2024",
        order:"1910",
        refunded:"24",
        deliverd:"1880",
        gross:"1,520,000",
        refunds:"32,100",
        net:"1,487,900"
    },
    {
        month:"February 2024",
        order:"1420",
        refunded:"16",
        deliverd:"1390",
        gross:"1,090,000",
        refunds:"12,400",
        net:"1,077,600"
    },
    {
        month:"January 2024",
        order:"1680",
        refunded:"58",
        deliverd:"1650",
        gross:"1,295,000",
        refunds:"44,100",
        net:"1,250,900"
    },
]
function AnalyticPage() {
  return (
    <div className='revenue-analytic'>
        <div className='revenue-header'>
            <p className='overview-text'>FINANCIAL OVERVIEW</p>
            <h1 className='revenue-heading'>Revenue Analytics Ledger</h1>
            <p className='revenue-subheading'>A detailed chronicle of fiscal performance, tracking the growth of our AHM Fragrance scent collection across the previous six months.</p>
        </div> 
        <div className='analytic-summary-card'>
            <div className='analytic-card'>
                <p>Total Annual Users</p>
                <h2>12,842</h2>
                <p>+14% from previous year</p>
            </div>
            <div className='analytic-card'>
                <p>Total Annual Revenue</p>
                <h2>PKR 8,245,000</h2>
                <p>Maintained 92% profit margin</p>
            </div>
            <div className='analytic-card'>
                <p>Total Annual Refunds</p>
                <h2 style={{color:" #BA1A1A"}}>PKR 142,300</h2>
                <p >1.7% of gross revenue</p>
            </div>
        </div>
        <div className='revenue-ledger'>
            <h2 className='ledger-title'>Monthly Revenue Ledger</h2>
            <div className='ledger-table'>
                <div className='ledger-table-header'>
                    <span>Month</span>
                    <span>Total Orders</span>
                    <span>Refunded Orders</span>
                    <span>Delivered</span>
                    <span>Payment Status</span>
                    <span>Gross (PKR)</span>
                    <span>Refunds (PKR)</span>
                    <span>Net Revenue (PKR)</span> 
                </div> 

                {revenueData.map((item, index) => (
                    <div className='ledger-table-row' key={index}>
                       <span>{item.month} </span>
                       <span>{item.order} </span>
                       <span>{item.refunded} </span>
                       <span>{item.deliverd} </span>
                       <span className='paid-status'>PAID</span>
                    <span>{item.gross} </span>
                    <span>{item.refunds} </span>
                    <span>{item.net} </span>
                   </div>  
                ))}      
            </div>   
        </div>      
    </div>
  )
}

export default AnalyticPage
