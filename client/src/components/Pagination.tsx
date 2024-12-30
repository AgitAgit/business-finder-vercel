import React, { useState } from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const [visiblePages, setVisiblePages] = useState([1]);

  const handlePageChange = (page) => {
    onPageChange(page);

    // Adjust visible pages based on current page
    const newVisiblePages = [];
    for (let i = page - 2; i <= page + 2; i++) {
      if (i > 0 && i <= totalPages) {
        newVisiblePages.push(i);
      }
    }
    setVisiblePages(newVisiblePages);
  };

  return (
    <nav className="flex justify-center space-x-2">
      <button
        className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          className={`border border-gray-300 rounded-md px-4 py-2 ${
            page === currentPage
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;