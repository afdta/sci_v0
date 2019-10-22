import url from "./url.js";
import vview from "./vview.js";

import analytics from "../../../../js-modules/analytics.js";

export default function metro_map(container){

    ////
    var metro_spec = {

        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 1000,
        "height": 900,
        "padding": {"top":0, "right":0, "bottom":0, "left":0},
        "autosize": {"type":"none", "resize":false},
        "title":{
            "text":"The majority of U.S. metro areas have low startup complexity"
        },
        "data" : [
            {
                "name": "states",
                "url": url.data + "statetopo.json",
                "format": {"type": "topojson", "feature": "state"}
            },
            {
                "name":"statemesh",
                "url": url.data + "statetopo.json",
                "format": {"type": "topojson", "mesh": "state"}
            },
            {
                "name": "cbsas",
                "url": url.data + "cbsa.json",
                "format": {"type": "topojson", "feature": "cbsa"}
            },
            {
                "name": "centroids",
                "source": "cbsas",
                "transform": [{
                    "type": "formula",
                    "expr": "geoCentroid('proj', datum)",
                    "as": ["centroid"]
                }]
            },
            {
                "name": "table",
                "url": url.data + "map_data.json",
                "transform": [
                    {
                        "type":"lookup",
                        "from":"centroids",
                        "key":"properties.GEOID",
                        "values":["centroid"],
                        "fields":["cbsa"]
                    },
                    {
                        "type":"formula",
                        "expr": "datum.metro=='Poughkeepsie-Newburgh-Middletown, NY' ? scale('proj', [-74.006498, 41.708606]) : datum.centroid",
                        "as": ["centroid2"]
                    }
                ]
            },
            {
                "name": "current_table",
                "source": "table",
                "transform": [
                    {
                        "type":"filter",
                        "expr":"current_metro !== null && datum.cbsa === current_metro"
                    },
                    {
                        "type":"fold",
                        "fields":["yf_per1000", "sci"],
                        "as":["indicator", "value"]
        
                    }
                ]
            },
            {
                "name":"labeldb",
                "source":"table",
                "transform":[
                    {
                        "type":"filter",
                        "expr":"datum.label !== null"
                    },
                    {
                        "type":"formula",
                        "expr":"sqrt(scale('size', datum.yf_per1000))/2",
                        "as":"radius"
                    },
                    {
                        "type":"formula",
                        "expr":"datum.radius * 0.851",
                        "as":"xon"
                    },
                    {
                        "type":"formula",
                        "expr":"datum.radius * 0.707",
                        "as":"yon"
                    }
                ]
            },
            {
                "name":"labelbelow",
                "values":[
                {"label":"New York"}, 
                {"label":"Chicago"},
                {"label":"Miami"},
                {"label":"Houston"}
                ]
            },
        ],
        
        "scales" : [
            {
            "name": "fill",
            "type": "quantize",
            "domain": {"data": "table", "field": "sci"},
            "range": {"scheme": "brownbluegreen", "count": 4}
            },
            {
            "name": "size",
            "domain": {"data": "table", "field": "yf_per1000"},
            "zero": false,
            "range": {"signal":"bub_sizes"}
            }
        
        ],
        
        "legends": [

            {
                "fill": "fill",
                "orient": {"signal": "width < 700 ? 'none' : 'bottom-right'"},
                "direction":"horizontal",
                "columns": 2,
                "title":"Startup Complexity Index (0-100)",
                "labelFontSize": 15,
                "titleFontSize": 15,
                "titleLimit": 350,
                "titlePadding": 10,
                "encode":{
                    "legend":{
                        "update":{
                            "x":{"value":32},
                            "y":{"signal":"map_height + 10"}
                        }
                    }
                }
            },

            {
                "size": "size",
                "orient": {"signal": "width < 700 ? 'none' : 'bottom-right'"},
                "direction":"horizontal",
                "values":[0.1, 1, 2, 4],
                "title":"Young firms per 1,0000 residents",
                "columns": 4,
                "colPadding": 0,
                "labelAlign":"left",
                "labelFontSize": 15,
                "titleFontSize": 15,
                "titlePadding": 0,
                "titleLimit": 350,
                "format": ".1f",
                "symbolStrokeColor": "#444444",

                "zindex":5,
                "encode":{
                    "legend":{
                        "update":{
                            "x":{"value":32},
                            "y":{"signal":"map_height + 80"}
                        }
                    },
                    "symbols":{
                        "update":{
                            "strokeWidth":{"value":2}
                        }
                    }
                }
            }
        
        ],
        
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
                "update": "container_width"
            },
            {
                "name": "projscale",
                "update":"width/0.9"
            },

            {
                "name": "ncols",
                "update": "width > 1100 ? 3 : 1",
            },

            {
                "name": "map_height",
                "update": "width*0.53"
            },

            {
                "name": "legend_height",
                "update": "ncols == 1 ? 160 : 100"
            },

            {
                "name": "height",
                "update": "map_height + legend_height"
            },

            {
                "name": "translateX",
                "update":"width/2"
            },
            {
                "name": "translateY",
                "update":"(map_height/2)"
            },
            {
                "name": "ttipX",
                "value": null,
                "on": [
                {
                    "events":"@metrobub:mousemove, @metrobub:mouseover", 
                    "update": "x()"
                }
                ]
            },
            {
                "name": "ttipY",
                "value": null,
                "on": [
                {
                    "events":"@metrobub:mousemove, @metrobub:mouseover", 
                    "update": "y() - 5"
                }
                ]
            },
            {
                "name": "current_metro",
                "value": null,
                "on": [
                {
                    "events":"@metrobub:mousemove, @metrobub:mouseover",
                    "update":"datum.cbsa"
                },
                {
                    "events":"@metrobub:mouseout",
                    "update":"null"
                }
                ]
            },
            {
                "name": "bub_sizes",
                "value" : [100,2500]
            },
            {
                "name": "current_metro_name",
                "value":"",
                "update": "length(data('current_table')) > 0 ? data('current_table')[0].metro : ''"
            },
            {
                "name": "map_hover",
                "value": null,
                "on": [
                    {
                        "events":"@metrobub:mouseover",
                        "update":"datum.metro"
                    }
                ]
            }
        ],

        "projections": [
            {
                "name": "proj",
                "type": "albersUsa",
                "scale": {"signal":"projscale"},
                "translate": [
                    {"signal":"translateX"},
                    {"signal":"translateY"}
                ] 
            }
        ],
        
        "marks" : [
            {
                "name": "stateshp",
                "type": "shape",
                "interactive": false,
                "z-index":1,
                "from": {"data": "states"},
                "encode": {
                "enter": { "fill": {"value":"#efefef"}, 
                            "stroke": {"value": "#aaaaaa"},
                            "strokeWidth": {"value": "1"}
                            }
                },
                "transform": [
                    { "type": "geoshape", "projection": "proj" }
                ]
            },


            {
                "type" : "symbol",
                "shape" : "circle",
                "name": "metrobub",
                "from" : {"data":"table"},
                "sort" : {"field":"size", "order":"descending"},
                "encode" : {
                    "update" : {
                        "x":{"signal":"datum.centroid2[0]"},
                        "y":{"signal":"datum.centroid2[1]"},
                        "size" : {"field":"yf_per1000", "scale":"size"},
                        "fill" : {"field":"sci", "scale":"fill"},
                        "strokeWidth" : {"value" : 0.5},
                        "stroke" : {"value":"#444444"}
                    },
                    "hover":{
                        "strokeWidth" : {"value":1.5}
                    }
                }
            },
            /*
            {
                "type" : "rule",
                "name" : "leader",
                "interactive" : false,
                "zindex" : 11,
                "from" : {"data":"labeldb"},
                "encode":{
                    "update" : {
                        "x2":{"signal":"datum.x + datum.xon + 7"},
                        "x" : {"signal":"datum.x + datum.xon"},
                        "y2":[
                            {"signal":"datum.y + datum.yon + 7", "test":"indata('labelbelow', 'label', datum.label)"},
                            {"signal":"datum.y - datum.yon - 7"}
                        ],
                        "y" :[
                            {"signal":"datum.y + datum.yon", "test":"indata('labelbelow', 'label', datum.label)"},
                            {"signal":"datum.y - datum.yon"}
                        ],
                        "stroke" : {"value":"#333333"}    
                    }     
                }
            },
        
            {
                "type" : "text",
                "zindex": 15,
                "name":"anno",
                "interactive":false,
                "from" : {"data":"leader"},
                "encode" : {
                    "update" : {
                        "x":{"signal":"datum.x2"},
                        "y":{"signal":"indata('labelbelow', 'label', datum.datum.label) ? datum.y2 + 7 : datum.y2"},
                        "text" : {"signal":"datum.datum.label"}
                    }
                }
            },
            {
                "type" : "text",
                "zindex" : 14,
                "name" : "anno0",
                "from" : {"data":"anno"},
                "interactive" : false,
                "encode" : {
                    "enter":{
                    "fill":{"value":"#ffffff"},
                    "stroke":{"value":"#ffffff"},
                    "strokeWidth":{"value":3}
                    },
                    "update" : {
                    "x":{"field":"x"},
                    "y":{"field":"y"},
                    "text" : {"field":"text"}
                    }
                }
            },
            */
        
        
        
            {
                "name":"tooltip",
                "type":"group",
                "zindex":20,
                "interactive":false,   
                "encode":{
                    "enter":{
                        "fill":{"value":"#ffffff"},
                        "stroke":{"value":"#999999"},
                        "cornerRadius":{"value":5},
                        "width":{"value":"230"},
                        "height":{"value":"200"},
                        "x":{"value":0},
                        "y":{"value":30}
                    },
                    "update": {
                        "x": [
                            {"test": "current_metro==null", "value":0},
                            {"test": "ttipX/width > 0.5", "signal":"ttipX - 235"},
                            {"signal": "ttipX + 5"}
                        ],
                        "y": [
                            {"test": "current_metro==null", "value":30},
                            {"test": "ttipY + 205 > height", "signal":"height - 205"},
                            {"signal": "ttipY"}
                        ],
                        "opacity" : [
                            {"test": "current_metro==null", "value":"0"},
                            {"value": "1"}
                        ]
                    }
                },
                "scales":[
                    {
                        "name":"ypos",
                        "type":"ordinal",
                        "domain":["yf_per1000", "sci"],
                        "range":[70,130]
                    },
                    {
                        "name":"lab",
                        "type":"ordinal",
                        "domain":["yf_per1000", "sci"],
                        "range":["Young firms per 1,000 residents", "Startup complexity index"]
                    }
                ],
                "marks":[
                    {
                        "name": "tooltip_title",
                        "type": "text",
                        "encode": {
                            "enter": {
                                "limit": {"value":210},
                                "x": {"value":10},
                                "y": {"value":35},
                                "fontWeight": {"value":"bold"},
                                "fontSize": {"value":"18"}
                            },
                            "update": {
                                "text": {"signal":"current_metro_name"},
                            }
                        }
                    },
                    {
                        "name":"value_labels",
                        "type":"text",
                        "from":{"data":"current_table"},
                        "interactive":"false",
                        "zindex":21,
                        "encode":{
                            "enter":{
                                "fontSize":{"value":"15"},
                                "fontWeight":{"value":"normal"},
                                "dy":{"value":0},
                                "x":{"value":10}
                            },
                            "update":{
                                "text":{"signal":"scale('lab',datum.indicator)"},
                                "y":{"signal":"scale('ypos',datum.indicator)"}
                            }
                        }
                    },
                    {
                        "name":"values",
                        "type":"text",
                        "from":{"data":"current_table"},
                        "interactive":"false",
                        "zindex":21,
                        "encode":{
                            "enter":{
                                "fontSize":{"value":"18"},
                                "fontWeight":{"value":"bold"},
                                "dy":{"value":24},
                                "x":{"value":10}
                            },
                            "update":{
                                "text":{"signal":"datum.indicator=='sci' ? format(datum.value, '.1f') : format(datum.value, '.2f')"},
                                "y":{"signal":"scale('ypos',datum.indicator)"}
                            }
                        }
                    }
                ]
            }
        
        ]
        
    }






    function post_process(view){
        d3.select("g.mark-shape.stateshp").attr("filter", "url('#feBlur2')");
        
        view.addSignalListener("map_hover", function(a,b){
            if(b !== null){
                analytics("map_hover", b);
            }
        })
    }


    vview(metro_spec, container, post_process);


}