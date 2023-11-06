import clsx from 'clsx';
import React, { memo } from 'react';
import { useSearchParams, useNavigate, useParams, createSearchParams, useLocation } from 'react-router-dom';

const PaginationItem = ({ children }) => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const handlePagination = () => {
        const queries = Object.fromEntries([...params]);

        if (Number(children)) queries.page = children;

        navigate({
            pathname: location.pathname,
            search: createSearchParams(queries).toString(),
        });
    };

    return (
        <button
            className={clsx(
                'mt-3 d-flex justify-content-center',
                !Number(children) && 'items-end btn pb-2',
                Number(children) && 'items-center cursor-pointer btn ',
                +params.get('page') === +children && 'rounded-full bg-gray-300',
                !+params.get('page') && children === 1 && 'rounded-full bg-gray-300',
            )}
            onClick={handlePagination}
            type="button"
            disabled={!Number(children)}
        >
            {children}
        </button>
    );
};

export default memo(PaginationItem);
