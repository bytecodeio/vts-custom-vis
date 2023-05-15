import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { Button, ButtonGroup } from "react-bootstrap";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';


export const Home = ({ data, config, queryResponse, details, done }) => {
  console.log("Here is the Looker query data: ", queryResponse);

  const products = [
    { id: 1, name: "apple", price: 1 },
    { id: 2, name: "orange", price: 2 },
    { id: 3, name: "banana", price: 3 },
    { id: 4, name: "peach", price: 2 },
    { id: 5, name: "carrot", price: 1 },
    { id: 6, name: "grapes", price: 4 },
    { id: 7, name: "mango", price: 1 },
    { id: 8, name: "potatoe", price: 3 },
    { id: 9, name: "onion", price: 3 }
  ];

  const columns = [
    {
      dataField: "id",
      text: "Product ID",
      sort: true
    },
    {
      dataField: "name",
      text: "Product Name",
      sort: true
    },
    {
      dataField: "price",
      text: "Product Price",
      sort: true,
      validator: (newValue, row, column) => {
        if (isNaN(newValue)) {
          return {
            valid: false,
            message: "Price should be numeric"
          };
        }
        if (newValue > 5) {
          return {
            valid: false,
            message: "Price should less than 6"
          };
        }
        return true;
      }
    }
  ];

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc"
    }
  ];



  return (

  <div className="container-fluid">
      <BootstrapTable
   bootstrap4
   keyField="id"
   data={products}
   columns={columns}
   defaultSorted={defaultSorted}

 />

        </div>



  );
};
