function main(){
    var modern = true;

    //var root = "https://c24215cec6c97b637db6-9c0895f07c3474f6636f95b6bf3db172.ssl.cf1.rackcdn.com/interactives/2019/startup-complexity/assets/js/";
    var root = "./assets/js/";

    try{
        //1. is sticky positioning supported 
        if(!CSS.supports("position","sticky") && !CSS.supports("position", "-webkit-sticky") ){
            throw new Error("Sticky position not supported");
        }

        //2. ES6 supported
        var es6support = function(){
            try {
              new Function("(v = 0) => v");
              return true;
            }
            catch (e) {
              return false;
            }
        }();

        if(!es6support){
            throw new Error("ES6 features not supported");
        }
    }
    catch(e){
        modern = false;
    }
    finally{
        var s=document.createElement("script");
        var s0=document.getElementsByTagName("script")[0];
        s.src= modern ? root + "app-es6.js" : root + "app-es5.js";
        s.type="text/javascript";
        s0.parentNode.insertBefore(s,s0);
    }
}

document.addEventListener("DOMContentLoaded", main);