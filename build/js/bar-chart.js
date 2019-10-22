import url from "./url.js";
import vview from "./vview.js";

export default function bar_chart(container){



    var bar_spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 1000,
        "height": 400,
        "padding": {"top":10, "right":0, "bottom":30, "left":20},
        "autosize": {"type":"fit", "resize":true},
      
        "data": [
          {
            "name": "table",
            "url": url.data + "corrs.json",
            "format": {"type": "json"}
        }],

        "signals": [
            {
                "name": "container_width",
                "update": "containerSize()[0]",
                "on": [
                    {
                        "events": {"source": "window", "type": "resize"},
                        "update": "containerSize()[0]"
                    }
                ]
            },
            {
                "name":"width",
                "update": "container_width - 30"
            }
        ],
      
        "scales": [
          {
            "name": "group_scale",
            "type": "band",
            "domain": {"data": "table", "field": "correlate"},
            "range": "width",
            "padding": 0.2
          },
          {
            "name": "yscale",
            "type": "linear",
            "domain": [0,0.8],
            "range": "height",
            "round": true,
            "zero": true,
            "nice": true
          },
          {
            "name": "color",
            "type": "ordinal",
            "domain": {"data": "table", "field": "name"},
            "range": ["#4da79e",
            "#fcd74e",
            "#cacaca"]
          },
          {
            "name": "labeler",
            "type": "ordinal",
            "domain": ["sci", "pci", "ba_share"],
            "range": ["Startup Complexity Index", "Patent Complexity Index", "Bachelor's+ attainment"]
          }
        ],

        "legends": [

            {
                "fill": "color",
                "orient": "bottom",
                "direction":"horizontal",
                "columns": {"signal":"container_width < 800 ? 1 : 3"},
                "columnPadding": 20,
                "rowPadding": 10,
                "title":  {"signal":"container_width < 800 ? ['Wage, income, and output per job', 'correlated with:'] : 'Wage, income, and output per job correlated with:'"},
                "titleLimit": 400,
                "titlePadding": 10,
                "labelLimit": 400,
                "labelOffset":{"signal":"container_width < 800 ? 15 : 5"},
                "offset": 40,
                "padding": 0,
                "symbolType": "square",
                "symbolSize": 400,
                "symbolOffset":{"signal":"container_width < 800 ? 10 : 0"},
                "encode": {
                    "labels":{
                        "update":{
                            "text": [
                                {"test":"datum.label=='sci'", "value":"Startup Complexity Index"},
                                {"test":"datum.label=='pci'", "value":"Patent Complexity Index"},
                                {"test":"datum.label=='ba_share'", "value":"Population with at least a bachelor's degree"}
                            ]
                        }
                    }
                }
            }
        ],
      
        "axes": [
            {
                "orient": "bottom", 
                "scale": "group_scale", 
                "tickSize": 0, 
                "labelPadding": 8, 
                "zindex": 1,
                "encode": {
                    "labels":{
                        "update":{
                            "text": {"signal": "width < 600 ? split(datum.label,' ') : datum.label"}
                        }
                    }
                }
            },
            {
                "orient": "left", 
                "scale": "yscale", 
                "title":"Correlation coefficient", 
                "titlePadding":10,
                "titleFontSize":15,
                "titleFontWeight":400,
                "titleAnchor":"end"
            }
        ],
      
        "marks": [
          {
            "type": "group",
      
           "from": {
              "facet": {
                "data": "table",
                "name": "facet",
                "groupby": "correlate"
              }
            },
      
            "encode": {
              "update": {
                "x": {"scale": "group_scale", "field": "correlate"}
              }
            },
      
            "signals": [
              {"name": "width", "update": "bandwidth('group_scale')"}
            ],
      
            "scales": [
              {
                "name": "pos",
                "type": "band",
                "range": "width",
                "domain": {"data": "facet", "field": "name"}
              }
            ],
      
            "marks": [
              {
                "name": "columns",
                "from": {"data": "facet"},
                "type": "rect",
                "encode": {
                  "update": {
                    "x": {"scale": "pos", "field": "name"},
                    "width": {"scale": "pos", "band": 1},
                    "y": {"scale": "yscale", "field": "value"},
                    "y2": {"scale": "yscale", "value": 0},
                    "fill": {"scale": "color", "field": "name"}
                  },
                  "enter":{
                    "tooltip": {"signal": "'Correlation: ' + datum.correlate + ' with ' + scale('labeler',datum.name) + ': ' + format(datum.value, '.2f') "}
                  }
                }
              },
              {
                "type": "text",
                "from": {"data": "columns"},
                "encode": {
                  "update": {
                    "x": {"signal": "datum.x + bandwidth('pos')/2"},
                    "y": {"field": "y", "offset": -8},
                    "fill": {"value":"#101010"},
                    "align": {"value": "center"},
                    "baseline": {"value": "middle"},
                    "text": {"signal": "format(datum.datum.value,'.2f')"}
                  }
                }
              }
            ]
          }
        ]
      }


    function post_process(){

    }


    vview(bar_spec, container, post_process);


}