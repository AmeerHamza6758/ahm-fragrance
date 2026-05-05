"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const sortOptions = [
  { id: "newest", label: "Newest First" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

export default function CollectionFilters({
  sortBy,
  onSortChange,
  activeTag,
  onTagChange,
  tagOptions,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const sortRef = useRef(null);
  const tagRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagOpen && tagRef.current && !tagRef.current.contains(event.target)) {
        setTagOpen(false);
      }
      if (sortOpen && sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tagOpen, sortOpen]);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="w-full flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-start lg:gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
          <span className="text-[#7E525C] text-xs lg:text-lg font-bold tracking-widest whitespace-nowrap">
            SORT:
          </span>
          <div className="relative w-full sm:w-[240px]" ref={sortRef}>
            <button
              className="flex items-center justify-between w-full px-5 py-2.5 border border-[#7E525C33] rounded-full text-[#4E4543] text-sm bg-white outline-none"
              onClick={() => {
                setSortOpen(!sortOpen);
                setTagOpen(false);
              }}
            >
              <span className="truncate">
                {sortOptions.find((opt) => opt.id === sortBy)?.label ?? "Newest First"}
              </span>
              {sortOpen ? (
                <ChevronUp size={18} className="shrink-0 ml-2" />
              ) : (
                <ChevronDown size={18} className="shrink-0 ml-2" />
              )}
            </button>

            {sortOpen && (
              <div className="absolute z-100 mt-1 w-full bg-white border border-[#7E525C33] rounded-2xl shadow-xl overflow-hidden left-0">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    className={`w-full text-left px-5 py-3 sort-option ${sortBy === opt.id ? "active" : ""}`}
                    onClick={() => {
                      onSortChange(opt.id);
                      setSortOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
          <span className="text-[#7E525C] text-xs lg:text-xl font-semibold tracking-widest">
            COLLECTION:
          </span>
          <div className="relative w-full sm:w-[240px]" ref={tagRef}>
            <button
              className="flex items-center justify-between w-full px-5 py-2.5 border border-[#7E525C33] rounded-full text-[#4E4543] text-sm bg-white outline-none"
              onClick={() => {
                setTagOpen(!tagOpen);
                setSortOpen(false);
              }}
            >
              <span className="truncate">
                {tagOptions.find((tag) => tag.id === activeTag)?.label ?? "All Collection"}
              </span>
              {tagOpen ? (
                <ChevronUp size={18} className="shrink-0 ml-2" />
              ) : (
                <ChevronDown size={18} className="shrink-0 ml-2" />
              )}
            </button>

            {tagOpen && (
              <div className="absolute z-100 mt-1 w-full bg-white border border-[#7E525C33] rounded-2xl shadow-xl 
              overflow-hidden left-0">
                <div className="collection-scrollbar max-h-[220px] overflow-y-auto">
                  {tagOptions.map((tag) => (
                    <button
                      key={tag.id}
                      className={`w-full text-left px-5 py-3 text-sm sort-option ${activeTag === tag.id ? "active" : ""}`}
                      onClick={() => {
                        onTagChange(tag.id);
                        setTagOpen(false);
                      }}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
