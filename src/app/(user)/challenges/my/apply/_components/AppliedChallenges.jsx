"use client";

import React from "react";
import Link from "next/link";
import ListHead from "./ListHead";
import ListRow from "./ListRow";
import Pagination from "@/components/pagination/Pagination";
import { usePathname } from "next/navigation";

export default function AppliedChallenges({ resultData, totalCount, page, pageSize, onPageChange }) {
  const pathname = usePathname();

  return (
    <div className="overflow-scroll">
      <ListHead />
      <div>
        {resultData?.map((data) => (
          <Link
            key={data.application.id}
            href={
              pathname.startsWith("/admin")
                ? `/admin/management/${data.application.id}`
                : `/challenges/my/apply/${data.application.id}`
            }
          >
            <ListRow data={data} />
          </Link>
        ))}
      </div>
      <div className="mt-5">
        <Pagination totalCount={totalCount} currentPage={page} pageSize={pageSize} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
