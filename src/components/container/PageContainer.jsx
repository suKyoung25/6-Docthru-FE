import React from "react";

/**
 * 다양한 페이지에서 재사용 가능한 컨테이너 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 컨테이너 내부에 표시될 콘텐츠
 * @param {string} props.className - 추가 스타일링을 위한 클래스명
 * @param {string} props.maxWidth - 컨테이너 최대 너비 (기본값: 'max-w-7xl')
 * @param {string} props.padding - 컨테이너 패딩 (기본값: 'px-4 sm:px-6 lg:px-8')
 * @param {string} props.margin - 컨테이너 마진 (기본값: 'mx-auto')
 * @returns {React.ReactElement} 컨테이너 컴포넌트
 */

export default function Container({
  children,
  className = "",
  maxWidth = "max-w-[1200px]",
  padding = "px-4",
  margin = "mx-auto",
  style = {},
}) {
  return (
    <div 
      style={style}
      className={`${maxWidth} ${padding} ${margin} ${className}`}>
      {children}
    </div>
  );
}
