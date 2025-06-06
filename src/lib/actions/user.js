"use server";

import { BASE_URL } from "@/constant/constant";
import { cookies } from "next/headers";

// 사용자 정보 조회
export async function getUserAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`
      }
    });

    if (!res.ok) {
      throw new Error("유저 정보를 불러오는데 실패했습니다.");
    }

    return await res.json();
  } catch (err) {
    console.error("getUserAction 에러:", err);
    throw err;
  }
}

// 나의 챌린지 목록 조회 (참여중, 완료한)
export async function getMyChallengesAction({ params = {} }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const query = new URLSearchParams();

  if (params.pageSize) query.append("pageSize", params.pageSize);
  if (params.cursor) query.append("cursor", params.cursor);
  if (params.category) query.append("category", params.category);
  if (params.docType) query.append("docType", params.docType);
  if (params.keyword) query.append("keyword", params.keyword);
  if (params.status) query.append("status", params.status);

  try {
    const res = await fetch(`${BASE_URL}/users/me/challenges?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`
      }
    });

    if (!res.ok) {
      throw new Error("챌린지 목록을 불러오는데 실패했습니다.");
    }

    return await res.json();
  } catch (err) {
    console.error("getMyChallengesAction 에러:", err);
    throw err;
  }
}

// 나의 챌린지 신청 목록 조회
export async function getMyApplicationsAction({ params = {} }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const query = new URLSearchParams(params).toString();

  try {
    const res = await fetch(`${BASE_URL}/users/me/applications?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`
      }
    });

    if (!res.ok) {
      throw new Error("챌린지 신청 목록을 불러오는데 실패했습니다.");
    }

    return await res.json();
  } catch (err) {
    console.error("getMyApplicationsAction 에러:", err);
    throw err;
  }
}

// 챌린지 신청 상세 조회
export async function getApplicationAction(applicationId) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetch(`${BASE_URL}/users/me/applications/${applicationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`
      }
    });

    if (!res.ok) {
      throw new Error("챌린지를 불러오는데 실패했습니다.");
    }

    return await res.json();
  } catch (err) {
    console.error("getApplicationAction 에러:", err);
    throw err;
  }
}

// 챌린지 작업물(랭킹) 조회
export async function getRankingAction(challengeId) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const pageSize = 5;
  let page = 1;
  let hasMore = true;
  let allWorks = [];

  while (hasMore) {
    const res = await fetch(`${BASE_URL}/challenges/${challengeId}/works?page=${page}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`
      },
      cache: "no-store"
    });

    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || "랭킹 데이터를 불러오지 못했습니다.");
    }

    const result = await res.json();
    const works = result.data;

    allWorks = [...allWorks, ...works];

    if (works.length < pageSize) {
      hasMore = false;
    } else {
      page += 1;
    }
  }

  return allWorks;
}

// 챌린지 삭제
export async function deleteChallengeAction(challengeId) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetch(`${BASE_URL}/challenges/${challengeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`
      }
    });

    if (!res.ok) {
      throw new Error("챌린지 삭제에 실패했습니다.");
    }

    return await res.json();
  } catch (err) {
    console.error("deleteApplicationAction 에러:", err);
    throw err;
  }
}
