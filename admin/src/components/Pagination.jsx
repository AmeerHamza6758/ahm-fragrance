import React from "react";
import "../styles/admin.css";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  totalEntries = 0,
  startEntry = 1,
  endEntry = 10,
}) => {
  // Generate page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <div className="pagination-124">
        <p>
          SHOWING {startEntry} TO {endEntry} OF {totalEntries} ENTRIES
        </p>
      </div>
      <div className="pagination-controls">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          {"<"}
        </button>
        
        {pages.map((page) => (
          <button
            key={page}
            className={currentPage === page ? "active-page" : ""}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
