import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { Button, ButtonGroup } from "react-bootstrap";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import * as $ from "jquery";

export const Home = ({ data, config, queryResponse, details, done }) => {

  console.log(queryResponse)



 let dimension_names = queryResponse.fields.dimensions.map((field) => {

   let dimensions = field.name;

   console.log(dimensions)

 });



let measures_names = queryResponse.fields.measures.map((field) => {

  let measures = field.name;

  console.log(measures)

});



  const { dimensions, measures } = queryResponse.fields;
  const dimensionNames = dimensions.map((d) => ({
    name: d.name,
    label: d.label_short,
  }));
  const measureNames = measures.map((d) => ({
    name: d.name,
    label: d.label_short,
  }));
  const headerNames = dimensionNames.concat(measureNames);
  const measureCells = measureNames.concat(measureNames);

  console.log(headerNames)
  console.log(measureCells)


  dimensionNames.forEach((d) => {
  console.log(d.label)
  });
  measureNames.forEach((m) => {
    console.log(m.label)
  });

let comment1 = `<div class="d-flex align-items-center"><img class="img-fluid" src="https://ixd-studio.wesdemo.com/liz/g.png"/> <p class="moveRight">Google</p></div>`

let comment2 = `<div class="d-flex align-items-center"><img class="img-fluid" src="https://ixd-studio.wesdemo.com/liz/star.png"/> <p class="moveRight">Starbucks</p></div>`

let comment3 = `<div class="d-flex align-items-center"><img class="img-fluid" src="https://ixd-studio.wesdemo.com/liz/sp.png"/> <p class="moveRight">Spotify</p></div>`

let comment4 = `<div class="d-flex align-items-center"><img class="img-fluid" src="https://ixd-studio.wesdemo.com/liz/st.png"/> <p class="moveRight">Stripe</p></div>`

let comment5 = `<div class="d-flex align-items-center"><img class="img-fluid" src="https://ixd-studio.wesdemo.com/liz/p.png"/> <p class="moveRight">Pinterest</p></div>`



let address1 = `<div class="d-flex flex-column"><h3>Bank of America Plaza</h3><p class="small">Floor 10 - 1012</p></div>`
let address2 = `<div class="d-flex flex-column"><h3>Park Plaza</h3><p class="small">Floor 10 - 1012</p></div>`
let address3 = `<div class="d-flex flex-column"><h3>145 Essex</h3><p class="small">Floor 10 - 1012</p></div>`


let icon1 = `<div class="d-flex flex-column"><p class="neg"><i class="far fa-frown"></i> Negative</p><p class="small">on 11/22/22</p></div>`
let icon2 = `<div class="d-flex flex-column"><p class="pos"><i class="far fa-smile"></i> Positive</p><p class="small">on 11/22/22</p></div>`
let icon3 = `<div class="d-flex flex-column"><p class="neut"><i class="far fa-meh"></i> Neutral</p><p class="small">on 11/22/22</p></div>`

let date1 = `<div class="d-flex align-items-center"><h3>7/31/23</h3></div>`
let date2 = `<div class="d-flex align-items-center"><h3>8/30/23</h3></div>`
let date3 = `<div class="d-flex align-items-center"><h3>10/31/23</h3></div>`
let date4 = `<div class="d-flex align-items-center"><h3>12/31/23</h3></div>`


let count = `<div class="d-flex align-items-center"><h3><i class="far fa-key"></i> 12</h3><h3><i class="far fa-eye ms-2"></i> 20</h3></div>`


let variance1 = `<div class="var d-flex justify-content-start align-items-center"><h3>45</h3><span class="type positive"><i class="fal fa-arrow-up"></i> 12%</span></div>`

let variance2 = `<div class="var d-flex justify-content-start align-items-center"><h3>122</h3><span class="type negative"><i class="fal fa-arrow-down"></i> 12%</span></div>`




  const products = [
    {

      name: <div dangerouslySetInnerHTML={{__html:comment1}} />,

      address:<div dangerouslySetInnerHTML={{__html:address1}} />,
      date:<div dangerouslySetInnerHTML={{__html:date1}} />,
      variance:<div dangerouslySetInnerHTML={{__html:variance1}} />,
      icon:<div dangerouslySetInnerHTML={{__html:icon1}} />,
      count:<div dangerouslySetInnerHTML={{__html:count}} />,
    },
    {

      name: <div dangerouslySetInnerHTML={{__html:comment2}} />,

      address:<div dangerouslySetInnerHTML={{__html:address2}} />,
      date:<div dangerouslySetInnerHTML={{__html:date2}} />,
      variance:<div dangerouslySetInnerHTML={{__html:variance2}} />,
      icon:<div dangerouslySetInnerHTML={{__html:icon2}} />,
        count:<div dangerouslySetInnerHTML={{__html:count}} />,
    },
    {

      name: <div dangerouslySetInnerHTML={{__html:comment3}} />,

      address:<div dangerouslySetInnerHTML={{__html:address3}} />,
      date:<div dangerouslySetInnerHTML={{__html:date3}} />,
      variance:<div dangerouslySetInnerHTML={{__html:variance1}} />,
      icon:<div dangerouslySetInnerHTML={{__html:icon3}} />,
        count:<div dangerouslySetInnerHTML={{__html:count}} />,
    },
    {


      name: <div dangerouslySetInnerHTML={{__html:comment4}} />,

      address:<div dangerouslySetInnerHTML={{__html:address1}} />,
      date:<div dangerouslySetInnerHTML={{__html:date4}} />,
      variance:<div dangerouslySetInnerHTML={{__html:variance1}} />,
      icon:<div dangerouslySetInnerHTML={{__html:icon1}} />,
        count:<div dangerouslySetInnerHTML={{__html:count}} />,
    },
    {
      name: <div dangerouslySetInnerHTML={{__html:comment5}} />,

      address:<div dangerouslySetInnerHTML={{__html:address2}} />,
      date:<div dangerouslySetInnerHTML={{__html:date4}} />,
      variance:<div dangerouslySetInnerHTML={{__html:variance2}} />,
      icon:<div dangerouslySetInnerHTML={{__html:icon2}} />,
        count:<div dangerouslySetInnerHTML={{__html:count}} />,
    },

  ];

  const columns = [
    {
      dataField: "name",
      id:"id",
      text: "Logo + Text",

    },
    {
      dataField: "address",
      id:"id",
      text: "2 line data cell",

    },
    {
      dataField: "date",
      text: "1 line text",
      // sort: true


    },
    {
      dataField: "variance",
      text: "1 line  + variance",

    },
    {
    dataField: "icon",
      text: "Icon + color",

    },
    {
  dataField: "count",
      text: "Icon + count",


    },
    {
    dataField: "variance",
      text: "Avatar",

    },
    {
      dataField: "price",
      text: "Progress bar",


    },
    {
      dataField: "id",
      text: "Tag",

    },
    {
      dataField: "",
      text: "Full color block",

    },

  ];



  return (

  <div className="container-fluid">



  <BootstrapTable
   bootstrap4
   keyField="id"
   data={products}
   columns={columns}


 />

        </div>



  );
};
