"use client";

import Image from "next/image";
import dropdownIcon from "@/assets/icon/ic_menu.svg";
import clockIcon from "@/assets/icon/ic_clock.svg";
import usersIcon from "@/assets/icon/ic_person.svg";
import { typeChipMap, categoryChipMap } from "../chip/chipMaps";
import ChipCardStatus from "@/components/chip/chipComplete/ChipCardStatus";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import DeclineModal from "../modal/DeclineModal";
import { deleteChallengeAction } from "@/lib/actions/admin";
import { BtnRoundedWithIcon } from "../btn/text/BtnText";

export default function ChallengeCard({
  challengeId,
  title,
  type,
  category,
  deadline,
  participants,
  maxParticipant,
  variant = "default",
  isAdmin,
  onClick
}) {
  const [status, setStatus] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    if (participants >= maxParticipant) {
      setStatus("closed");
    } else if (now > deadlineDate) {
      setStatus("expired");
    } else {
      setStatus("");
    }
  }, [deadline, maxParticipant, participants]);

  // 외부 클릭 시 드롭다운 닫기 로직
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const formatDateToPretty = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  };

  const handleEdit = () => {
    router.push(`/admin/challenges/${challengeId}/edit`);
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    setIsDeclineModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleConfirmDelete = async (adminMessage) => {
    try {
      await deleteChallengeAction(challengeId, adminMessage);
      setIsDeclineModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("챌린지 삭제 실패:", error);
      alert("챌린지 삭제에 실패했습니다: " + error.message);
    }
  };

  return (
    <div
      className={`flex flex-col ${variant === "simple" ? "h-auto justify-start" : "justify-between"} ${variant === "simple" ? "" : "rounded-[12px] border-2 border-[var(--color-gray-800)]"} bg-white p-4`}
    >
      <div className="relative flex items-start justify-between">
        {status ? (
          <ChipCardStatus status={status} />
        ) : (
          <div className="mt-1 mb-1 text-xl font-semibold text-gray-800 sm:text-[22px]" onClick={onClick}>
            {title}
          </div>
        )}
        {isAdmin ? (
          <div ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Image src={dropdownIcon} alt="드롭다운" width={24} height={24} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-4 right-0 z-10 mt-2 w-28 rounded-md border border-gray-200 bg-white shadow-lg">
                <button
                  onClick={handleEdit}
                  className="block w-full px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-100"
                >
                  수정하기
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-100"
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {status && (
        <div className="mt-1 mb-1 text-xl font-semibold text-gray-800 sm:text-[22px]" onClick={onClick}>
          {title}
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        {categoryChipMap[category] ?? null}
        {typeChipMap[type] ?? null}
      </div>

      {variant !== "simple" && (
        <>
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 pb-2 text-sm text-gray-500">
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <div className="flex items-center gap-1">
                <Image src={clockIcon} alt="시계" width={16} height={16} />
                <span>{formatDateToPretty(deadline)} 마감</span>
              </div>
              <div className="flex items-center gap-1">
                <Image src={usersIcon} alt="사람" width={16} height={16} />
                <span>
                  {participants}/{maxParticipant}
                </span>
              </div>
            </div>
            {pathname.includes("/my") ? (
              <div className="items-end">
                <BtnRoundedWithIcon
                  theme="link"
                  iconType="continueChallenge"
                  onClick={() => router.push(`/challenges/${challengeId}/works/${workId}`)}
                >
                  내 작업물 보기
                </BtnRoundedWithIcon>
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      )}
      {isDeclineModalOpen && (
        <DeclineModal
          text="삭제"
          onClose={() => {
            setIsDeclineModalOpen(false);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
