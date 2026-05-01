import { useState , useEffect} from "react";
import PageSection from "../components/PageSection";
import "../styles/admin.css"

const stockData = [
  {
    id: "AHM-FRG-001",
    name: "Oud Royale",
    size: "100ML",
    current: 45,
    previous: 52,
    restock: "Oct 12, 2023",
  },
  {
    id: "#AHM-FRG-008",
    name: "Velvet Peony",
    size: "50ML",
    current: 8,
    previous: 54,
    restock: "Sep 28, 2023",
  },
  {
    id: "#AHM-FRG-059",
    name: "Midnight Oud",
    size: "100ML",
    current: 0,
    previous: 12,
    restock: "Aug 01, 2023",
  },
  {
    id: "#AHM-FRG-031",
    name: "Ambar Night",
    size: "100ML",
    current: 60,
    previous: 55,
    restock: "Act 24, 2023",
  },
  {
    id: "#AHM-FRG-022",
    name: "Citrus Bloom",
    size: "50ML",
    current: 2,
    previous: 40,
    restock: "Aug 19, 2023",
  },
  {
    id: "#AHM-FRG-015",
    name: "Signature Rose",
    size: "100ML",
    current: 12,
    previous: 18,
    restock: "Act 05, 2023",
  },
  {
    id: "#AHM-FRG-044",
    name: "Jasmine Silk",
    size: "50ML",
    current: 25,
    previous: 28,
    restock: "Act 18, 2023",
  },
  {
    id: "#AHM-FRG-062",
    name: "Sandalwood Aura",
    size: "50ML",
    current: 15,
    previous: 20,
    restock: "Nov 02, 2023",
  },
];
function StockPage() {
    const [openMenu, setOpenMenu] = useState(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
          if (!e.target.closest(".actions")) {
            setOpenMenu(null);
          }
        };
    
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
      }, []);
    
      const handleEdit = (id) => {
        console.log("Edit:", id);
      };
      const handleDelete = (id) => {
    console.log("Delete:", id);
  };
  return (
    <div className="stock-registry">

      {/* Header */}
      <div className="stock-header">
        <h1 className="stock-title">Stock Registry</h1>
        <p className="stock-subtitle">
           Refine your artisanal fragrance inventory. Monitor real-time stock levels and update quantities with botanical precision. 
        </p>
      </div>

      {/* Summary cards */}
      <div className="stock-summary">
        <div className="summary-card">
          <p>Total Stock</p>
          <h3>124 Items</h3>
        </div>

        <div className="summary-card">
          <p>Out Of Stock</p>
          <h3 style={{color:"#BA1A1A"}}>03</h3>
        </div>
      </div>

      {/* Table */}
      <div className="stock-table">

        <div className="stock-table-header">
          <span>Product ID</span>
          <span>Product Name</span>
          <span>Size</span>
          <span>Current Stock</span>
          <span>Previous</span>
          <span>Last Restock</span>
          <span>Actions</span>
        </div>

        {stockData.map((item, index) => (
          <div className="stock-row" key={index}>
            <span>{item.id}</span>
            <span>{item.name}</span>
            <span>{item.size}</span>
            <span className={item.current <= 8 ? "low-stock" : ""}>
              {item.current}
            </span>
            <span>{item.previous}</span>
            <span>{item.restock}</span>
            <div className="actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu(openMenu === item.id ? null : item.id)
                }}
              > ⋮ </button>
              {openMenu === item.id && (
                <div className="drop">
                  <h4 style={{color:'brown', paddingTop:"0px", paddingLeft:"20px"}}>ADD QUANTITY</h4>
                  <input 
                     type="text"
                     placeholder="Enter amount"
                     className="drop-btn"/>
                  <button style={{width:"150px", height:"40px", background:"#ecedef", marginTop:"10px", borderRadius:"32px", marginLeft:"15px" }}>Update Stock</button>
                </div>
              )}
            </div>
          </div>        
        ))}
      </div>
      <div className="pagination">
      <div className="pagination-124">
         <p>Showing 8 of 124 products</p>
      </div>
      <div>
        <button>{"<"}</button>  
        <button className="active-page">1</button>
        <button>2</button>
        <button>3</button>
        <button>{">"}</button>
      </div>
    </div>
    </div>
  );
}

export default StockPage;
