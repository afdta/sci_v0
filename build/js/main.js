import degradation from "../../../../js-modules/degradation.js";
import metro_map from "./metro-map.js";
import bar_chart from "./bar-chart.js";

//main function
function main(){

  var root_el = document.getElementById("interactive-map");
  var compat = degradation(root_el);

      //build svg filters
      var defs = d3.select("#svg-defs").append("div").style("visibility","hidden").style("height","1px").append("svg").append("defs");
  
      var filter2 = defs.append("filter").attr("id","feBlur2").attr("width","150%").attr("height","150%");
      filter2.append("feOffset").attr("result","offsetout").attr("in","SourceGraphic").attr("dx","2").attr("dy","2");
      filter2.append("feColorMatrix").attr("result","matrixout").attr("in","offsetout").attr("type","matrix").attr("values","0.25 0 0 0 0 0 0.25 0 0 0 0 0 0.25 0 0 0 0 0 0.5 0");
      filter2.append("feGaussianBlur").attr("result","blurout").attr("in","matrixout").attr("stdDeviation","5");
      filter2.append("feBlend").attr("in","SourceGraphic").attr("in2","blurout").attr("mode","normal"); 

  metro_map(root_el);
  bar_chart(document.getElementById("interactive-chart"));
  
  //d3.selectAll("p.map-action-call").style("display","block");

} //close main()


main();
