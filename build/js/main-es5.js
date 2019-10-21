import url from './url.js';

//main function
function main(){

  function add_static(container, file){
    var wrap = d3.select(container);
    var src = url.altimg + file;

    wrap.selectAll("*").remove();
    wrap.append("div").append("img").attr("src", src).style("width","100%").style("height","auto");

    wrap.insert("p", ":first-child").style("margin","15px 32px")
    .style("font-size","15px").style("font-family", "franklin-gothic-urw,helvetica,sans-serif").style("color","#4c4c4c")
    .html("<em>Note: For a full interactive experience, please use an up-to-date modern browser (e.g. Chrome, Firefox, Safari, or Edge)</em>");
  }

  add_static(document.getElementById("interactive-map"), "Map.png");

} //close main()

main();

