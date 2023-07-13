import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import './Table.css';
import Footer from '../footer/Footer';

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div>
      <table className="my-table" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  className="table-header"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr className="table-row" {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td className="table-cell" {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div className="pagination">
        <button onClick={() => previousPage()} disabled={!canPreviousPage}
          style={{ borderRadius: '1em', border: 'none', backgroundColor: 'grey', margin: '.5em', color: 'white', width: '6em', height: '2em' }}
        >
          Previous
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}
          style={{ borderRadius: '1em', border: 'none', backgroundColor: 'grey', margin: '.5em', color: 'white', width: '6em', height: '2em' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
