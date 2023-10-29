import React, { useMemo } from 'react';
import { generateRange } from '../utils/helper.js';
import { BiDotsHorizontalRounded } from 'react-icons/bi';

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
    const paginationArray = useMemo(() => {
        const pageSize = +import.meta.env.VITE_REACT_APP_LIMIT || 10;
        const paginationCount = Math.ceil(+totalProductCount / pageSize);
        const totalPaginationItem = siblingCount + 5;

        if (paginationCount <= totalPaginationItem) return generateRange(1, paginationCount);

        const isShowLeft = currentPage - siblingCount > 2;
        const isShowRight = currentPage + siblingCount < paginationCount - 1;

        if (isShowLeft && !isShowRight) {
            const rightStart = paginationCount - 4;
            const rightRange = generateRange(rightStart, paginationCount);

            return [1, <BiDotsHorizontalRounded />, ...rightRange];
        }

        if (!isShowLeft && isShowRight) {
            const rightRange = generateRange(1, 5);

            return [...rightRange, <BiDotsHorizontalRounded />, paginationCount];
        }

        const siblingLeft = Math.max(currentPage - siblingCount, 1);
        const siblingRight = Math.min(currentPage + siblingCount, paginationCount);

        if (isShowLeft && isShowRight) {
            const middlerange = generateRange(siblingLeft, siblingRight);
            return [1, <BiDotsHorizontalRounded />, ...middlerange, <BiDotsHorizontalRounded />, paginationCount];
        }
    }, [totalProductCount, currentPage, siblingCount]);

    return paginationArray;
};

export default usePagination;

// Thành phần: first + last + current + sibling + 2 * DOTS
// min = 6 => sibling + 5
// totalPagination (số lượng trang tính toán được): 62, limitProducts = 10 => = 7 (62/10) = 6.2 = 6 => 0.2*10 product
// totalPaginationItem (Tổng số item): sibling + 5
// sibling = 1

// [1,2,3,4,5,6]
// [1, ..., 6, 7, 8, 9, 10]
// [1, 2, 3, 4, 5, ..., 10]
// [1, ..., 5, 6, 7, ..., 10]
