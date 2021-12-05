export const loadGoogleScript = () => {
  // I feel like adding the "function" is a typo but apparently it works?
  console.log("Hello")
  const id = 'google-js'
  const src = "https://apis.google.com/js/api.js" // Quad used platform.js

  const firstJs = document.getElementsByTagName('script')[0] // because react

  if(document.getElementById(id)) return;
  else{
    const js = document.createElement('script');
    js.id = id
    js.src = src;
    js.onload = window.onGoogleScriptLoad; // fascinating
    firstJs.parentNode.insertBefore(js, firstJs);
  }
}