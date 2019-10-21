import analytics from "../../../../js-modules/analytics.js";

export default function vview(spec, container, callback, download_anchor){
    
    //theme
    var fontFamily = "franklin-gothic-urw,helvetica,sans-serif";
    var theme = {
    "text":{
        "font": fontFamily,
        "fontSize":13,
        "fill":"#101010"
        },
    "legend":{
        "layout":{
            "margin": 45,
            "anchor": "middle"
            },
        "titleFontWeight": "700",
        "titleColor": "#444444",
        "labelColor": "#444444"
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
                callback.call(container);
            }
        })
        ;

    view.addSignalListener("map_hover", function(a,b){
        if(b !== null){
            analytics("map_hover", b);
        }
    })

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