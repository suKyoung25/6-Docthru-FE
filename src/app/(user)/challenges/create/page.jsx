"use client";

import BtnText from "@/components/btn/text/BtnText";
import React, { useState } from "react";
import Input from "./component/Input";
import CategoryClosed from "@/components/dropDown/category/CategoryClosed";
import CategoryItems from "@/components/dropDown/category/CategoryItems";
import CategoryOpened from "@/components/dropDown/category/CategoryOpened";

export default function page() {
  const [title, setTitle] = useState("");
  const [originUrl, setOriginUrl] = useState("");
  const [maxParticipant, setMaxParticipant] = useState("");
  const [content, setContent] = useState("");
  const [isCategory, setIsCategory] = useState(false);
  const [isDocType, setIsDocType] = useState(false);

  return (
    <div className="font-pretendard px-[16px] pt-[16px] pb-[87px] text-[18px] text-[var(--color-gray-900)]">
      <div className="font-bold">신규 챌린지 신청</div>

      <div className="flex flex-col gap-[24px] pt-[16px] pb-[24px] text-[14px]">
        <Input
          title={"제목"}
          placeholder={"제목을 입력해주세요"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          height={"h-[48px]"}
        />
        <Input
          title={"원문 링크"}
          placeholder={"원문 링크를 입력해주세요"}
          value={originUrl}
          onChange={(e) => setOriginUrl(e.target.value)}
          height={"h-[48px]"}
        />
        <div className="flex h-full flex-col gap-[8px]">
          <div className="flex flex-col gap-[24px] text-sm font-medium text-[var(--color-gray-900)]">
            분야
            <CategoryClosed setIsCategory={setIsCategory} />
            {isCategory && <CategoryItems />}
            문선 타입
            <CategoryClosed setIsDocType={setIsDocType} />
            {isDocType && <CategoryItems />}
          </div>
        </div>
        <Input
          title={"최대 인원"}
          placeholder={"인원을 입력해주세요"}
          value={maxParticipant}
          onChange={(e) => setMaxParticipant(e.target.value)}
          height={"h-[48px]"}
        />
        <Input
          title={"내용"}
          placeholder={"내용을 입력해주세요"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          height={"h-[219px]"}
        />
      </div>

      <div className="h-[48px] w-[343px]">
        <BtnText
          theme="solidblack"
        // icon={} onClick={} className={} children={}
        >
          신청하기
        </BtnText>
      </div>
    </div>
  );
}
