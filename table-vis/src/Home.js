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
  let avatar = `<div class="d-flex align-items-center"><img class="img-fluid avatar" src="https://ixd-studio.wesdemo.com/liz/avatar.png"/> <p class="ms-2 small black">Marianne Lewis</p></div>`

  let variance1 = `<div class="var d-flex justify-content-start align-items-center"><h3>45</h3><span class="type positive"><i class="fal fa-arrow-up"></i> 12%</span></div>`

  let variance2 = `<div class="var d-flex justify-content-start align-items-center"><h3>122</h3><span class="type negative"><i class="fal fa-arrow-down"></i> 12%</span></div>`


  let progress1 = `<div class="position-relative"><div class="progress"><div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div></div><span class="progress-label">25%</span></div>`

  let progress2 = `<div class="position-relative"><div class="progress"><div class="progress-bar" role="progressbar" style="width: 36%" aria-valuenow="36" aria-valuemin="0" aria-valuemax="100"></div></div><span class="progress-label">36%</span></div>`

  let progress3 = `<div class="position-relative"><div class="progress"><div class="progress-bar" role="progressbar" style="width: 81%" aria-valuenow="81" aria-valuemin="0" aria-valuemax="100"></div></div><span class="progress-label">81%</span></div>`
  let progress4 = `<div class="position-relative"><div class="progress"><div class="progress-bar" role="progressbar" style="width: 11%" aria-valuenow="11" aria-valuemin="0" aria-valuemax="100"></div></div><span class="progress-label">11%</span></div>`

  let tag1 = `<div class="d-flex justify-content-start align-items-center mb-0"><span class="tag neutral">Neutral</span><span class="tag branded">Branded</span></div>`

  let tag2 = `<div class="d-flex justify-content-start align-items-center mb-0"><span class="tag critical">Critical</span></div>`

  let tag3 = `<div class="d-flex justify-content-start align-items-center mb-0"><span class="tag warning">Warning</span></div>`

  let tag4 = `<div class="d-flex justify-content-start align-items-center mb-0"><span class="tag success">Success</span></div>`

  let tag5 = `<div class="d-flex justify-content-start align-items-center mb-0"><span class="tag informational">Informational</span></div>`

  let block1 = `<div class="positiveBlock">+25%</div>`

  let block2 = `<div class="negativeBlock">-25%</div>`


  const products = [
    {

      name: <div dangerouslySetInnerHTML={{__html:comment1}} />,
      address:<div dangerouslySetInnerHTML={{__html:address1}} />,
      date:<div dangerouslySetInnerHTML={{__html:date1}} />,
      variance:<div dangerouslySetInnerHTML={{__html:variance1}} />,
      icon:<div dangerouslySetInnerHTML={{__html:icon1}} />,
      count:<div dangerouslySetInnerHTML={{__html:count}} />,
      avatar:<div dangerouslySetInnerHTML={{__html:avatar}} />,
      progress:<div dangerouslySetInnerHTML={{__html:progress1}} />,
      tag:<div dangerouslySetInnerHTML={{__html:tag1}} />,
      block:<div dangerouslySetInnerHTML={{__html:block1}} />,
    },
    {

      name: <div dangerouslySetInnerHTML={{__html:comment2}} />,

      address:<div dangerouslySetInnerHTML={{__html:address2}} />,
      date:<div dangerouslySetInnerHTML={{__html:date2}} />,
      variance:<div dangerouslySetInnerHTML={{__html:variance2}} />,
      icon:<div dangerouslySetInnerHTML={{__html:icon2}} />,
      count:<div dangerouslySetInnerHTML={{__html:count}} />,
      avatar:<div dangerouslySetInnerHTML={{__html:avatar}} />,
      progress:<div dangerouslySetInnerHTML={{__html:progress2}} />,
      tag:<div dangerouslySetInnerHTML={{__html:tag2}} />,
      block:<div dangerouslySetInnerHTML={{__html:block1}} />,
    },
    {

      name: <div dangerouslySetInnerHTML={{__html:comment3}} />,

      address:<div dangerouslySetInnerHTML={{__html:address3}} />,
      date:<div dangerouslySetInnerHTML={{__html:date3}} />,
      variance:<div dangerouslySetInnerHTML={{__html:variance1}} />,
      icon:<div dangerouslySetInnerHTML={{__html:icon3}} />,
      count:<div dangerouslySetInnerHTML={{__html:count}} />,
      avatar:<div dangerouslySetInnerHTML={{__html:avatar}} />,
      progress:<div dangerouslySetInnerHTML={{__html:progress3}} />,
      tag:<div dangerouslySetInnerHTML={{__html:tag3}} />,
      block:<div dangerouslySetInnerHTML={{__html:block2}} />,
    },
    {


      name: <div dangerouslySetInnerHTML={{__html:comment4}} />,

      address:<div dangerouslySetInnerHTML={{__html:address1}} />,
      date:<div dangerouslySetInnerHTML={{__html:date4}} />,
      variance:<div dangerouslySetInnerHTML={{__html:variance1}} />,
      icon:<div dangerouslySetInnerHTML={{__html:icon1}} />,
      count:<div dangerouslySetInnerHTML={{__html:count}} />,
      avatar:<div dangerouslySetInnerHTML={{__html:avatar}} />,
      progress:<div dangerouslySetInnerHTML={{__html:progress1}} />,
      tag:<div dangerouslySetInnerHTML={{__html:tag4}} />,
      block:<div dangerouslySetInnerHTML={{__html:block1}} />,
    },
    {
      name: <div dangerouslySetInnerHTML={{__html:comment5}} />,

      address:<div dangerouslySetInnerHTML={{__html:address2}} />,
      date:<div dangerouslySetInnerHTML={{__html:date4}} />,
      variance:<div dangerouslySetInnerHTML={{__html:variance2}} />,
      icon:<div dangerouslySetInnerHTML={{__html:icon2}} />,
      count:<div dangerouslySetInnerHTML={{__html:count}} />,
      avatar:<div dangerouslySetInnerHTML={{__html:avatar}} />,
      progress:<div dangerouslySetInnerHTML={{__html:progress4}} />,
      tag:<div dangerouslySetInnerHTML={{__html:tag5}} />,
      block:<div dangerouslySetInnerHTML={{__html:block2}} />,
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
      dataField: "avatar",
      text: "Avatar",

    },
    {
      dataField: "progress",
      text: "Progress bar",


    },
    {
      dataField: "tag",
      text: "Tag",

    },
    {
      dataField: "block",
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
