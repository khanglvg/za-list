import hasClass from "./hasClass";

function addClass(el, className) {
  if (
    el &&
    el.classList &&
    typeof el.classList.add === "function") {
    el.classList.add(className);
  } else if (!hasClass(el, className)) {
    if(typeof el.className === "string") {
      el.className = `${el.className}${className}`;
    } else {
      // eslint-disable-next-line no-mixed-operators
      el.setAttribute('class', `${el.className && el.className.baseVal || ''}${className}`);
    }
  }
}

export default addClass;