"use server";

import { BASE_URL } from "@/constant/constant";

//챌린지 수정하기
export async function updateChallenge(data) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const { challengeId, title, originalUrl, maxParticipant, description, deadline, category, docType } = data;

  const postData = {
    title,
    originalUrl,
    maxParticipant,
    description,
    deadline,
    category,
    docType
  };

  const res = await fetch(`${BASE_URL}/challenges/${challengeId}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Cookie: `accessToken=${accessToken}`
    },
    credentials: "include",
    body: JSON.stringify(postData)
  });

  if (!res.ok) throw new Error("챌린지를 수정할 수 없습니다.");

  return res.json();
}
