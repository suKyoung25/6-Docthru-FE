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
    <>
      <div className="overflow-auto">
        <ListHead />
        <div>
          {resultData?.map((data) => (
            <Link
              key={data?.id}
              href={
                pathname.startsWith("/admin") ? `/admin/management/${data?.id}` : `/challenges/my/apply/${data?.id}`
              }
            >
              <ListRow data={data} />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <Pagination totalCount={totalCount} currentPage={page} pageSize={pageSize} onPageChange={onPageChange} />
      </div>
    </>
  );
}
