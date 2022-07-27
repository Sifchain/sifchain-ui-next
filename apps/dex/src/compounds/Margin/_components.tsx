type NoResultsTrProps = {
  colSpan: number;
  message: string;
};

export function NoResultsRow(props: NoResultsTrProps) {
  return (
    <tr>
      <td colSpan={props.colSpan} className="text-gray-400 text-center p-20">
        {props.message}
      </td>
    </tr>
  );
}

type PaginationShowItemsProps = {
  limit: number;
  page: number;
  total: number;
};
export function PaginationShowItems({
  limit,
  page,
  total,
}: PaginationShowItemsProps) {
  const initial = limit * page;
  return (
    <p className="text-sm mx-4 py-3">
      <span>Showing</span>
      <span className="mx-1">{initial > total ? total : limit * page}</span>
      <span>of</span>
      <span className="mx-1">{total}</span>
      <span>items</span>
    </p>
  );
}

type PaginationShowPagesProps = {
  page: number;
  pages: number;
};
export function PaginationShowPages({ page, pages }: PaginationShowPagesProps) {
  return (
    <p className="text-sm mx-4 py-3">
      <span>Page</span>
      <span className="mx-1">{page}</span>
      <span>of</span>
      <span className="mx-1">{pages}</span>
      <span>pages</span>
    </p>
  );
}

type PaginationButtonsProps = {
  pages: number;
  render: (page: number) => React.ReactNode;
};
export function PaginationButtons({ pages, render }: PaginationButtonsProps) {
  return (
    <ul className="mx-4 flex flex-row text-sm">
      {Array.from({ length: pages }, (_, index) => {
        const page = ++index;
        return (
          <li key={index} className="flex-1 flex flex-col">
            {render(page)}
          </li>
        );
      })}
    </ul>
  );
}
