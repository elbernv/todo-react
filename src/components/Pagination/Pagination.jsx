import { useContext } from 'react';
import Pagination from 'react-bootstrap/Pagination';

import { PaginationContext } from '../../context/PaginationContext';

export function CustomPagination({ fetchFunction }) {
  const { paginationData } = useContext(PaginationContext);
  const paginationItems = 5;
  let numbering = [...Array(paginationItems + 1).keys()].slice(1);

  if (
    paginationData.page % paginationItems === 0 ||
    paginationData.page > paginationItems
  ) {
    numbering = [...Array(paginationData.page + paginationItems).keys()].slice(
      paginationData.page,
    );
  }

  return (
    <Pagination>
      <Pagination.First
        onClick={() => {
          fetchFunction({ page: 1 });
        }}
        disabled={paginationData.page === 1}
      />
      <Pagination.Prev
        onClick={() => {
          fetchFunction({ page: paginationData.page - 1 });
        }}
        disabled={paginationData.page === 1}
      />
      {paginationData.page >= paginationItems && (
        <Pagination.Item
          onClick={() => {
            fetchFunction({ page: 1 });
          }}
        >
          {1}
        </Pagination.Item>
      )}

      {paginationData.totalPages > paginationItems &&
        paginationData.page >= paginationItems && (
          <Pagination.Ellipsis disabled={true} />
        )}

      {numbering.map((number) => {
        return (
          <Pagination.Item
            key={number}
            disabled={number > paginationData.totalPages}
            active={paginationData.page === number}
            onClick={() => {
              fetchFunction({ page: number });
            }}
          >
            {number}
          </Pagination.Item>
        );
      })}

      {numbering[0] + paginationItems <= paginationData.totalPages && (
        <Pagination.Ellipsis disabled={true} />
      )}
      {numbering[0] + paginationItems <= paginationData.totalPages && (
        <Pagination.Item
          onClick={() => {
            fetchFunction({ page: paginationData.totalPages });
          }}
        >
          {paginationData.totalPages}
        </Pagination.Item>
      )}
      <Pagination.Next
        disabled={paginationData.page === paginationData.totalPages}
        onClick={() => {
          fetchFunction({ page: paginationData.page + 1 });
        }}
      />
      <Pagination.Last
        disabled={paginationData.page === paginationData.totalPages}
        onClick={() => {
          fetchFunction({ page: paginationData.totalPages });
        }}
      />
    </Pagination>
  );
}
