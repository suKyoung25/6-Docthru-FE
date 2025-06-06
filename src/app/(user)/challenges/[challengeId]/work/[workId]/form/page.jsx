"use client";

import Container from "@/components/container/PageContainer";
import EditorHeader from "./_components/EditorHeader";
import { useParams, useRouter } from "next/navigation";
import { useDraft } from "@/hooks/work/useDraft";
import { useModalControl } from "@/hooks/work/useModalControl";
import { useWorkData } from "@/hooks/work/useWorkData";
import dynamic from "next/dynamic";
import OriginalPageModal from "./_components/OriginalPageModal";
import OriginalPageModalBtn from "./_components/OriginalPageModalBtn";

// 동적 임포트로 변경하여 초기 로딩 최적화
const DraftModal = dynamic(() => import("@/components/modal/DraftModal"), {
  ssr: false
});
const DraftCheckModal = dynamic(() => import("./_components/DraftCheckModal"), {
  ssr: false
});
const ConfirmActionModal = dynamic(() => import("@/components/modal/ConfirmActionModal"), {
  ssr: false
});
const RedirectNoticeModal = dynamic(() => import("@/components/modal/RedirectNoticeModal"), {
  ssr: false
});
const Editor = dynamic(() => import("./_components/Editor"), {
  loading: () => <EditorSkeleton />,
  ssr: false
});

// 스켈레톤 UI를 별도 컴포넌트로 분리
function EditorSkeleton() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <div
        className="mx-auto h-[100px] w-full rounded-md bg-gray-100"
        style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
      />
      <div
        className="mx-auto h-[700px] w-full rounded-md bg-gray-100"
        style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
      />
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const { challengeId, workId } = useParams();
  const { modalState, updateModalState } = useModalControl();
  const {
    content,
    setContent,
    workMeta,
    isClosed,
    isLoading,
    isError,
    isAuthError,
    isSubmitted,
    handleUpdateWork,
    handleDeleteWork
  } = useWorkData(challengeId, workId, updateModalState);
  const { draftState, updateDraftState, toggleDraftModal, saveDraft, loadDraft } = useDraft(workId, setContent);

  return (
    <div className="relative">
      <Container
        maxWidth="max-w-4xl"
        className={
          modalState.isOriginalPageOpen
            ? "mt-[350px] transition-all duration-300 md:mt-0 md:mr-[300px] 2xl:mr-[640px]"
            : ""
        }
      >
        <EditorHeader
          workId={workId}
          challengeTitle={workMeta.challengeTitle}
          content={content}
          onDraft={saveDraft}
          isSubmitted={isSubmitted}
          isSubmitModal={() => updateModalState("isSubmitConfirmOpen", true)}
          onDiscardModal={() => updateModalState("isDeleteConfirmOpen", true)}
        />

        <div className="flex flex-col gap-4">
          {/* 제목을 항상 먼저 렌더링하여 LCP 개선 */}
          <span className="text-2xl font-bold">{workMeta.challengeTitle || "로딩 중..."}</span>

          {isLoading ? (
            <EditorSkeleton />
          ) : (
            <Editor
              challengeTitle={workMeta.challengeTitle}
              content={content}
              handleContent={setContent}
              onDraft={saveDraft}
              isDrafting={draftState.isDrafting}
            />
          )}
        </div>
      </Container>

      {/* 원문 페이지 버튼은 항상 표시 */}
      <OriginalPageModalBtn
        isOriginalPageModal={modalState.isOriginalPageOpen}
        onOpenOriginalPageModal={() => updateModalState("isOriginalPageOpen", !modalState.isOriginalPageOpen)}
      />

      <OriginalPageModal
        originalPageUrl={workMeta.originalUrl}
        onClose={() => updateModalState("isOriginalPageOpen", false)}
        modalState={modalState.isOriginalPageOpen}
      />

      {draftState.hasDraft && (
        <DraftCheckModal setHasDraft={(value) => updateDraftState("hasDraft", value)} onDraftModal={toggleDraftModal} />
      )}

      {draftState.isModalOpen && <DraftModal onClose={toggleDraftModal} isLoggedIn={true} onLoadItem={loadDraft} />}

      {modalState.isDeleteConfirmOpen && (
        <ConfirmActionModal
          text="정말 포기하시겠습니까?"
          onClose={() => updateModalState("isDeleteConfirmOpen", false)}
          onConfirm={handleDeleteWork}
          isLoggedIn={true}
        />
      )}

      {modalState.isSubmitConfirmOpen && (
        <ConfirmActionModal
          text={`${isSubmitted ? "제출" : "수정"}하시겠습니까?`}
          onClose={() => updateModalState("isSubmitConfirmOpen", false)}
          onConfirm={() => {
            handleUpdateWork();
            updateModalState("isContinue", true);
          }}
          isLoggedIn={true}
        />
      )}

      {modalState.isContinue && (
        <ConfirmActionModal
          text="작업물 수정이 완료되었습니다. 계속 수정하시겠습니까?"
          onClose={() => router.push(`/challenges/${challengeId}`)}
          onConfirm={() => updateModalState("isContinue", false)}
          isLoggedIn={true}
        />
      )}

      {isAuthError && (
        <RedirectNoticeModal
          text="작업물 수정 권한이 없습니다. 오류가 지속될 경우 관리자에게 문의해주세요."
          buttonText="돌아가기"
          redirectUrl={`/challenges/${challengeId}`}
        />
      )}

      {isClosed && (
        <RedirectNoticeModal
          text="이미 종료된 챌린지 입니다."
          buttonText="돌아가기"
          redirectUrl={`/challenges/${challengeId}`}
        />
      )}

      {isError && (
        <RedirectNoticeModal
          text="존재하지 않는 작업물입니다. 오류가 지속될 경우 관리자에게 문의해주세요."
          buttonText="돌아가기"
          redirectUrl={`/challenges/${challengeId}`}
        />
      )}
    </div>
  );
}

// CSS 키프레임 애니메이션 추가
const styles = `
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
`;

// 스타일 태그 추가
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
