!function(n,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.MyWidget=e():n.MyWidget=e()}(self,(()=>(()=>{function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},n(e)}function e(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(n);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,o)}return t}function t(n){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?e(Object(r),!0).forEach((function(e){o(n,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):e(Object(r)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(r,e))}))}return n}function o(e,t,o){return(t=function(e){var t=function(e){if("object"!=n(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var o=t.call(e,"string");if("object"!=n(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==n(t)?t:t+""}(t))in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}return function(){function n(){var n=document.currentScript||document.getElementById("widget-script");if(n){var o,r=n.getAttribute("data-config-token"),a=n.getAttribute("data-theme")||"light",i=document.createElement("div");i.className="my-widget-container",n.parentNode?n.parentNode.insertBefore(i,n.nextSibling):document.body.appendChild(i),r?(o=r,fetch("".concat("https://gardencenter.vercel.app","/api/widget-config/").concat(o)).then((function(n){return n.json()})).catch((function(n){throw console.error("Error fetching configuration:",n),n}))).then((function(n){e(i,t(t({},n),{},{theme:a}))})).catch((function(n){console.error("Error loading widget configuration:",n),e(i,{theme:a})})):e(i,{theme:a})}else console.error("Widget script tag not found.")}function e(n,e){var t=e.title,o=void 0===t?"Choose Your Preferences":t,r=e.message,a=void 0===r?"Select your yard space and style preferences":r,i=e.logoUrl,c=e.brandColor,l=void 0===c?"#000000":c,d=e.theme,s=void 0===d?"light":d;if(n.innerHTML='\n      <div class="widget-content '.concat(s,'" style="--brand-color: ').concat(l,';">\n        ').concat(i?'<img src="'.concat(i,'" alt="Logo" class="widget-logo">'):"","\n        <h3>").concat(o,"</h3>\n        <p>").concat(a,'</p>\n        \x3c!-- Step 1: Choose Yard Space --\x3e\n        <div id="step-1" class="step active">\n          <h4>Choose a starting yard space:</h4>\n          <div class="grid">\n            <label class="card">\n              <input type="radio" name="yardSpace" value="Part-shade, East Facing">\n              <img src="path-to-image1.jpg" alt="Part-shade, East Facing">\n              <div class="card-content">\n                <h5>Part-shade, East Facing</h5>\n                <p>An east-facing yard, with shade in the back</p>\n              </div>\n            </label>\n            <label class="card">\n              <input type="radio" name="yardSpace" value="Full Sun, South Facing">\n              <img src="path-to-image2.jpg" alt="Full Sun, South Facing">\n              <div class="card-content">\n                <h5>Full Sun, South Facing</h5>\n                <p>A south-facing yard, receiving full sun</p>\n              </div>\n            </label>\n          </div>\n          <button id="continue-to-step-2" disabled>Continue</button>\n        </div>\n\n        \x3c!-- Step 2: Choose Style Preference --\x3e\n        <div id="step-2" class="step">\n          <h4>Style preference:</h4>\n          <div class="grid">\n            <label class="card">\n              <input type="checkbox" name="style" value="Drought Tolerant">\n              <img src="path-to-image3.jpg" alt="Drought Tolerant">\n              <div class="card-content">\n                <h5>Drought Tolerant</h5>\n                <p>Water conservation, using drought-tolerant plants</p>\n              </div>\n            </label>\n            <label class="card">\n              <input type="checkbox" name="style" value="English/Traditional">\n              <img src="path-to-image4.jpg" alt="English/Traditional">\n              <div class="card-content">\n                <h5>English/Traditional</h5>\n                <p>Format design, structured layouts, flowering plants</p>\n              </div>\n            </label>\n            <label class="card">\n              <input type="checkbox" name="style" value="Pollinator">\n              <img src="path-to-image5.jpg" alt="Pollinator">\n              <div class="card-content">\n                <h5>Pollinator</h5>\n                <p>Supports pollinators like bees, butterflies, and more</p>\n              </div>\n            </label>\n          </div>\n          <button type="submit" id="submit-button" disabled>Submit</button>\n        </div>\n        \n        \x3c!-- Response --\x3e\n        <div id="widget-response" style="display: none;"></div>\n      </div>\n    '),!document.getElementById("my-widget-styles")){var p=document.createElement("style");p.id="my-widget-styles",p.textContent="\n        .my-widget-container {\n          margin: 16px 0;\n        }\n        .widget-content {\n          padding: 16px;\n          border-radius: 8px;\n          font-family: Arial, sans-serif;\n          text-align: center;\n          background-color: var(--brand-color, #ffffff);\n          color: ".concat("light"===s?"#000000":"#ffffff",";\n        }\n        .widget-logo {\n          max-width: 100px;\n          margin-bottom: 16px;\n        }\n        /* Grid Styles */\n        .grid {\n          display: flex;\n          gap: 16px;\n          justify-content: space-around;\n        }\n        .card {\n          position: relative;\n          display: flex;\n          flex-direction: column;\n          width: 45%;\n          border-radius: 8px;\n          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n          overflow: hidden;\n          cursor: pointer;\n        }\n        .card input {\n          margin-right: 8px;\n        }\n        .card img {\n          width: 100%;\n          height: auto;\n          object-fit: cover;\n        }\n        .card-content {\n          padding: 16px;\n        }\n        .card-content h5 {\n          margin: 0;\n          font-size: 1.2rem;\n        }\n        .card-content p {\n          font-size: 0.9rem;\n          margin: 8px 0 0;\n        }\n        #widget-form button {\n          padding: 8px 16px;\n          background-color: #ffffff;\n          border: 1px solid var(--brand-color, #000000);\n          cursor: pointer;\n          color: var(--brand-color, #000000);\n          margin-top: 16px;\n        }\n        #widget-form button:hover {\n          background-color: var(--brand-color, #000000);\n          color: #ffffff;\n        }\n        #widget-response {\n          margin-top: 16px;\n        }\n        .step {\n          display: none;\n        }\n        .step.active {\n          display: block;\n        }\n      "),document.head.appendChild(p)}var u=n.querySelector("#step-1"),f=n.querySelector("#step-2"),g=n.querySelector("#continue-to-step-2"),y=n.querySelector("#submit-button"),m=n.querySelector("#widget-form");u.querySelectorAll('input[name="yardSpace"]').forEach((function(n){n.addEventListener("change",(function(){g.disabled=!1}))})),g.addEventListener("click",(function(){u.classList.remove("active"),f.classList.add("active")})),f.querySelectorAll('input[name="style"]').forEach((function(n){n.addEventListener("change",(function(){var n=f.querySelectorAll('input[name="style"]:checked');y.disabled=0===n.length}))})),m.addEventListener("submit",(function(n){n.preventDefault(),function(n){var e=new FormData(n),t={};e.forEach((function(n,e){t[e]||(t[e]=[]),t[e].push(n)}));var o=function(n){return"Thank you for your submission! You selected: ".concat(n.yardSpace.join(", ")," for yard space, and ").concat(n.style.join(", ")," for style preferences.")}(t),r=n.parentElement.querySelector("#widget-response");r.textContent=o,r.style.display="block",n.reset()}(m)}))}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",n):n()}(),{}})()));