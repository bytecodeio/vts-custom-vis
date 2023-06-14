import React, { cloneElement, useMemo } from "react";
import styled from "styled-components";
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from "react-table";
import { columnSize } from "@looker/components/DataTable/Column/columnSize";
import { ContactPageSharp, DoNotStepOutlined, LegendToggle } from "@mui/icons-material";

const Styles = styled.div`
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;300;500;600;700&family=Open+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Roboto:wght@100;500;700&display=swap');
@import url("https://kit-pro.fontawesome.com/releases/v5.15.1/css/pro.min.css");

#vis-container {
  height: 100%;
  max-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'IBM Plex Sans';
  font-weight:300;
}


#vis {

    min-height: 500px;
}

#vis th {
  display: none !important;
}

body{
    font-family: 'IBM Plex Sans' !important
}
thead th{
  font-size:12px !important;
  color:#666666!important;
  font-weight:300;
  font-family: 'IBM Plex Sans';
  text-align:left;
}
 tbody > tr > td {
     vertical-align: middle;
}

tbody > tr > td,
tbody > tr > th,
tfoot > tr > td,
tfoot > tr > th,
thead > tr > td,
thead > tr > th {
    border: none;
}

table img{
  width:33px !important
}

.moveRight{
  margin:0em 0em 0em .5em !important;
    font-family: 'IBM Plex Sans';
}

h3{
  color:#1D1E20 !important;
  font-size:13px !important;
  margin-bottom: 0 !important;
  color:#1D1E20 !important;
  font-weight:400 !important;
  font-family: 'IBM Plex Sans';
}
.var h3{
  width:2em
}

p.small{
  color:#72777E !important;
  font-weight:300 !important;
  font-size:11px  !important;
  font-family: 'IBM Plex Sans';
}

p {

    margin-bottom: 0rem !important;
}

p.black{
  color:black !important
}

span.type{
margin-left:.75em;
font-size:12px;
border-radius: 0.25rem;
padding: 0.25em 0.55em;
}

span.type.positive {
    background: #EEF8E8;
    color: #39800B;
}

span.type.positive i{
transform: rotate(45deg);
}
span.type.negative {
    background: #FBE7E5;
    color:#C7200A;
}

span.type.negative i{
transform: rotate(315deg);
}

span.tag {

    font-size:11px;
    padding: .25em 1.55em;
    border-radius: 1rem;
    color:#1D1E20;
    font-weight: 400;
}

span.tag:first-child{
  margin-right:.5em
}

.neutral{
background: #E8EDF3
}


.branded{
background: #CCCCFF
}


.critical{
  background:#FDB6B0
}

.warning{
  background:#FFD87F;
  position: relative;
  padding: .25em .75em .25em 1.55em !important;
}
.warning::before{
  font-family: "Font Awesome 5 Pro";
  position: absolute;
  content: "\f06a";
  display: inline-block;
  left:5px;
  top:4px
}



.success{
  background:#D1ECC0
}
.informational{
  background:#B6DFF7;
  position: relative;
  padding: .25em .75em .25em 1.55em !important;
}

.informational::before{
  font-family: "Font Awesome 5 Pro";
  position: absolute;
  content: "\f05a";
  display: inline-block;
  left:5px;
  top:4px
}

.neg{
  color:#C7200A;
  font-size:12px;
}

.pos{
  color:#008759;
  font-size:12px;
}

.neut{
  color:#FF9E00;
  font-size:12px;
}


p.sentiment{
  font-size:12px;
}

.progress {
    --bs-progress-height: .5rem !important;
    --bs-progress-font-size: 0.55rem !important;
    --bs-progress-bg: #E5E5E5 !important;
    --bs-progress-border-radius: 100px !important;

    --bs-progress-bar-color: #fff;
    --bs-progress-bar-bg: #887EFC !important;
    max-width:70% !important;
}

.progress-label {
    position: absolute;
    right: 0;
    color: #000000;
    font-size: 10px;
    top: -3px;
    font-weight: 300;

}

.positiveBlock{

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color:#000000;
  font-size: 14px;
  font-weight: 300;

}

.positiveBlock:before{
  position:absolute;
  content:"";
  width: 100%;
  height: 236%;

  left:0;
  background-color:rgba(209, 236, 192, 1);
  z-index: -1
}

.negativeBlock:before{
  position:absolute;
  content:"";
  width: 100%;
  height: 240%;

  left:0;
  background-color:rgba(253, 182, 176, 1);
  z-index: -1
}


.negativeBlock{
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  color:#000000;
  font-size: 14px;
  font-weight: 300;
}

td div{
  position: relative;
}

.react-bootstrap-table table {
    table-layout: unset !important;
}

.avatar{
width: 150px;
height: 150px;
border-radius: 50%;


object-fit: cover;
object-position: center right;
}

@media (max-width: 991px) {


  .positiveBlock:before,
  .negativeBlock:before{
    width:0%;
    height:0%
  }

  .positiveBlock,
  .negativeBlock{
    justify-content: flex-start;
  }
   thead th {
    display: none;
  }
    tbody td,
    tbody th {
    display: block;

  }

  tbody{
    display: flex;
    flex-wrap: wrap;
    width:100%
  }
  tr{
    width:50%;
    margin-bottom:2em
  }

  [row-header] {
    position: relative;
    width: 50%;
    vertical-align: middle;
  }
  [row-header]:before {
    content: attr(row-header);
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    width: 50%;
    padding-right:30px;
  }
}


tr{
  border-bottom: 1px solid #D0D9E1;
}

td{
  display: flex !important;

    align-items: center;
}

  .table {
  font-family: 'IBM Plex Sans';
    display: inline-block;
    border-spacing: 0;

    .th {
      font-size: 12px;
      text-transform: capitalize;
  font-family: 'IBM Plex Sans';
      color: white;
      text-align: left;
      border-right: 1px solid white;
      font-weight: 200;
    }
    .td {
      font-size: 12px;
      text-align: left;
  font-family: 'IBM Plex Sans';
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      font-family: 'IBM Plex Sans';

      ${"" /* In this example we use an absolutely position resizer,
       so this is required. */
  }
      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        width: 10px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;
        ${"" /* prevents from scrolling while dragging on touch devices */}
        touch-action:none;

        &.isResizing {
        }
      }
    }
  }
`;

function Table({ columns, data }) {

  // BEGIN:01 - This is the code that allows the table to have dynamic columns based on included data
  // let workingCols = []

  // columns.map(
  //   (col) => {
  //     // console.log("col accessor", col.accessor)
  //     workingCols.push(col.accessor)
  //   }
  // )

  // // loop through each item for each key, removing a key when data is detected for that key.
  // // remove any colums with matching keys at are left after check

  // // TODO: need to convert to for look so we can break out of it when we detemine all columns contain data.
  // data.map((item) => {

  //   let tempCols = []

  //   workingCols.map(
  //     (key) => {
  //       if (item[key].value.toString().trim().length > 0) {
  //         // data, will remote from array of columns to remote.
  //         tempCols.push(key)
  //       }
  //       // remove tempCols from workingCols and continue loop.
  //       // if len of workingCols = 0, break loop.
  //     })

  //   // remove tempCols from workingCols and continue loop.
  //   tempCols.map((item) => {
  //     let index = workingCols.indexOf(item);
  //     if (index !== -1) {
  //       workingCols.splice(index, 1);
  //     }
  //   })
  //   // if len of workingCols = 0, break loop. TODO

  // })

  // // testing
  // // workingCols = ["show_viz"]
  // // if any workingCols are left, they have no data, remove time from columns.
  // workingCols.map((col) => {
  //   const index = columns.findIndex(object => {
  //     return object.accessor === col;
  //   });

  //   if (index !== -1) {
  //     columns.splice(index, 1);
  //   }
  // })
// END:01 - This is the code that allows the table to have dynamic columns based on included data

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 40,
      width: 200,
      maxWidth: 400,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    resetResizing,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      disableSortRemove: true,
      defaultCanSort: true
    },
    useSortBy,
    useBlockLayout,
    useResizeColumns
  );

  return (
    <>
      <div>
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="th"
                  >
                    {column.render("Header")}
                    <span>
                      {/* {column.isSorted ? (column.isSortedDesc ? "↓"  : "↑"  ) : " "}  */ }
                      {column.isSorted ?  "⇅"  : " "}
                    </span>
                    {/* Use column.getResizerProps to hook up the events correctly */}
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${column.isResizing ? "isResizing" : ""
                        }`}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="tr">
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className="td">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

const createLabel = (label) => {
  const splitByDot = label.split(".").join(" ");
  const splitByDash = splitByDot.split("_").join(" ");
  return splitByDash;
};

export const CustomTable = ({ data, config, queryResponse, details, done }) => {
  const [firstData = {}] = data;

  // Find cols to remove.  These will be passed thorugh a comma delimited list in a dimension
  // currently nanmed columns_to_hide
  let cols_to_hide = []
  for (const [key, value] of Object.entries(firstData)) {
    if ( key.split(".")[1]==="columns_to_hide"){
      cols_to_hide = firstData[key].value.split(",").map((e=>e.trim()))
      break;
    }
  }

  // if we have any to hide, just remove them:
  cols_to_hide.map((col) => {
    delete firstData[col]
  })

  // const data2 = useMemo(() => data, [] )

  const columns = useMemo(
    () =>
      Object.keys(firstData).map((key) => {




        return {
          Header: createLabel(key),
          accessor: (d) => {
            return d[key].value
          },

          sortable: true,

          sortType: 'basic',
          // Cell: (  { row: { original } }) => {
          //   return original[key]?.rendered || original[key]?.value;
          // },
          Cell: ({ cell, value, row }) => {
            // const row = cell.row.original;
            return row.original[key]?.rendered || row.original[key]?.value;
          },
          headerClassName: "table-header1",
        };
      }),
    []
  );

  return (
    <Styles>
      <Table columns={columns} data={data}  />
    </Styles>
  );
};
