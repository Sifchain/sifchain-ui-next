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
