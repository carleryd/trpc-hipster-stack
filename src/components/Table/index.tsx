import {
  CircularProgress,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

type Item = {
  id: string;
  heading: string;
  TableItem: ({
    id,
    isSelected,
  }: {
    id: string;
    isSelected: boolean;
  }) => React.ReactNode;
};

type Props = {
  items: Item[];
  selectedItemIds: string[];
  isLoading: boolean;
};

export const Table = ({ items, selectedItemIds, isLoading }: Props) => {
  const headings = items.map(({ heading }) => heading);

  return (
    <TableContainer>
      {isLoading && <CircularProgress />}
      <MuiTable>
        <TableHead>
          <TableRow>
            {headings.map((heading) => (
              <TableCell>{heading}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(({ id, TableItem }, index) => {
            const isActivitySelected = selectedItemIds.includes(id);

            // TODO: Use react stuff, also how about selected?'
            return (
              <TableItem key={index} id={id} isSelected={isActivitySelected} />
            );

            // return (
            //   <ListActivityItem
            //     key={index}
            //     activity={activity}
            //     isActivitySelected={isActivitySelected}
            //   />
            // );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};
