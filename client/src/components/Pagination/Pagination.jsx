import React, { memo } from 'react';
import usePagination from '~/hooks/usePagination';
import { useSearchParams } from 'react-router-dom';
import PaginationItem from './PaginationItem';

const Pagination = ({ totalCount }) => {
    const [params] = useSearchParams();
    const pagination = usePagination(totalCount, +params.get('page') || 1);

    const range = () => {
        const curentPage = +params.get('page');
        const pageSize = 7;
        const start = Math.min((curentPage - 1) * pageSize + 1, totalCount);
        const end = Math.min(curentPage * pageSize, totalCount);

        return `${start} - ${end}`;
    };

    // 3 => 21 - 30

    return (
        <div className="d-flex justify-content-center align-items-center flex-column">
            {!+params.get('page') && (
                <span className="text-sm">{`Có ${Math.min(totalCount, 1)} - ${Math.min(
                    7,
                    totalCount,
                )} bài tập của Tổng ${totalCount} bài tập`}</span>
            )}
            {params.get('page') && (
                <span className="text-sm italic">{`Có ${range()} bài tập của Tổng ${totalCount} bài tập`}</span>
            )}
            <div className="d-flex align-items-center">
                {pagination?.map((el) => (
                    <PaginationItem key={el}>{el}</PaginationItem>
                ))}
            </div>
        </div>
    );
};

export default memo(Pagination);
