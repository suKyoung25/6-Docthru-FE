"use server";

import { API_URL } from "@/constant/constant";
import { cookies } from "next/headers";

// accessToken을 안전하게 추출
const getAccessToken = async () => {
  const cookieStore = await cookies(); // 동기
  const token = cookieStore.get("accessToken"); // 동기
  return token?.value;
};

// fetch 요청에 사용할 headers 구성
const getAuthHeaders = async () => {
  const accessToken = await getAccessToken(); // 반드시 await 필요
  return {
    "Content-Type": "application/json",
    Cookie: `accessToken=${accessToken}`
  };
};

// 챌린지 목록 가져오기
export async function getChallenges(
  { page = 1, pageSize = 4, category, docType, keyword, status, adminStatus },
  myChallengeStatus
) {
  const headers = await getAuthHeaders();

  const params = new URLSearchParams();
  params.set("page", page);
  params.set("pageSize", pageSize);

  if (category) {
    //다중 쿼리 파라미터를 보낼 수 있도록
    if (Array.isArray(category)) {
      category.forEach((cat) => params.append("category", cat));
    } else {
      params.set("category", category);
    }
  }
  if (docType) params.set("docType", docType);
  if (keyword) {
    const cleanedKeyword = keyword.replace(/\s+/g, "");

    params.set("keyword", cleanedKeyword);
  }
  if (status) params.set("status", status);

  const isMyChallenge = typeof myChallengeStatus === "string" && myChallengeStatus.trim() !== "";

  const path = isMyChallenge ? "/users/me/challenges" : "/challenges";

  if (isMyChallenge) {
    params.set("myChallengeStatus", myChallengeStatus);
  }

  if (adminStatus) {
    params.set("adminStatus", adminStatus);
  }

  const url = `${API_URL}${path}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include"
    });

    console.log("📡 요청 URL:", url);
    console.log("📡 요청 Headers:", headers);
    console.log("📡 응답 Status:", res.status);

    if (!res.ok) throw new Error("챌린지 목록을 가져올 수 없습니다.");

    const json = await res.json();

    // 문제: 응답 자체가 null이거나 json.data가 아예 없는 경우
    if (!json || typeof json !== "object") {
      console.warn("⚠️ 응답이 예상과 다름:", json);
      return { data: [], totalCount: 0 };
    }

    console.log("📦 응답 데이터요:", json);

    return {
      data: Array.isArray(json?.data) ? json.data : [],
      totalCount: typeof json?.totalCount === "number" ? json.totalCount : 0
    };
  } catch (error) {
    console.error("서버 액션 - 챌린지 목록 오류", error);
    throw error;
  }
}
