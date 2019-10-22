export default function vview(spec, container, callback, download_anchor){
    
    //theme
    var fontFamily = "franklin-gothic-urw,helvetica,sans-serif";
    var theme = {
    "text":{
        "font": fontFamily,
        "fontSize":15,
        "fill":"#4c4c4c"
        },
    "legend":{
        "layout":{
            "anchor": "start"
            },
        "titleFontWeight": "700",
        "titleColor": "#4c4c4c",
        "labelColor": "#4c4c4c",
        "titleFont": fontFamily,
        "titleFontSize": 16,
        "labelFont": fontFamily,
        "labelFontSize": 15,
        "columnPadding":20
        },
    "axis":{
        "labelFont": fontFamily,
        "labelFontSize": 15,
        "labelFontColor": "#4c4c4c",
        "titleFontColor": "#4c4c4c"
    }
    }

    //download options
    var hide_link = true;
    var link = null;

    if(arguments.length > 3){
        var download_wrap = d3.select(download_anchor);
        hide_link = download_wrap.classed("inactive-map-download");
        link = download_wrap.html("").append("a").text("Download").node();
    }

    var view = new vega.View(vega.parse(spec, theme));

    view.hover()
        .initialize(container)
        .renderer("svg")
        .runAsync()
        .then(function(){
            try{
                if(!hide_link){toURL();}
            }
            catch(e){
                download_wrap.classed("inactive-map-download",true);
            }

            if(typeof callback === "function"){
                callback.call(container, view);
            }
        })
        ;


    view.addDataListener("table", function(a,b){
        console.log(a);
        console.log(b.filter(function(a){return a.centroid == null}));
    });

    //render as png
    function toURL(){
        if(link != null){
            link.setAttribute('target','_blank');
            link.setAttribute('download', "Map.png");
            link.style.visibility = 'hidden';

            view.toImageURL('png', 2).then(function(url){
                link.setAttribute('href', url);
                link.style.visibility = 'visible';
            });
        }
    }

}