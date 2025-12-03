import { useState, useEffect } from 'react';
import { getTodos } from '@/utils/api';

// 여러 날짜의 Todo 개수를 조회하는 훅
export function useTodoCount(dates: string[]) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const countMap: Record<string, number> = {};
        
        // 모든 날짜에 대해 병렬로 조회
        await Promise.all(
          dates.map(async (date) => {
            const todos = await getTodos(date);
            countMap[date] = todos.length;
          })
        );
        
        setCounts(countMap);
      } catch (error) {
        console.error('Error fetching todo counts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (dates.length > 0) {
      fetchCounts();
    }
  }, [dates.join(',')]); // dates 배열이 변경될 때만 재조회

  return { counts, isLoading };
}
