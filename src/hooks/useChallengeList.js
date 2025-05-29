import { getChallenges } from "@/lib/api/challenge-api/searchChallenge";
import { useState, useEffect, useCallback } from "react";

const useChallenges = (myChallengeStatus) => {
  const [filters, setFilters] = useState({
    categories: [],
    docType: "",
    status: ""
  });
  const [challenges, setChallenges] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const getInitialPageSize = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth > 375 ? 5 : 4;
    }
    return 4;
  };

  const [pageSize, setPageSize] = useState(getInitialPageSize);
  const [filterCount, setFilterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getChallengesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const options = {
        page,
        pageSize,
        keyword,
        category: filters.categories[0] || "",
        docType: filters.docType,
        status: filters.status,
        myChallengeStatus
      };

      const challengesResults = await getChallenges(options);
      setTotalCount(challengesResults.totalCount);
      const results = challengesResults.data;

      setChallenges(results);
    } catch (err) {
      console.error("챌린지 목록 불러오기 실패:", err);
      setError("챌린지 목록을 불러오는 데 실패했습니다.");
      setChallenges([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, keyword, filters.categories, filters.docType, filters.status, myChallengeStatus]);

  useEffect(() => {
    getChallengesData();
  }, [getChallengesData, myChallengeStatus]);

  useEffect(() => {
    setPage(1);
  }, [filters, keyword]);

  const applyFilters = useCallback(({ fields, docType, status }) => {
    setFilters({
      categories: fields,
      docType,
      status
    });

    const currentFilterCount = [fields.length > 0 ? 1 : 0, docType ? 1 : 0, status ? 1 : 0].filter(Boolean).length;

    setFilterCount(currentFilterCount);
  }, []);

  return {
    challenges,
    totalCount,
    page,
    pageSize,
    keyword,
    filters,
    filterCount,
    isLoading,
    error,
    setPage,
    setKeyword,
    applyFilters,
    setChallenges,
    setTotalCount
  };
};

export default useChallenges;
