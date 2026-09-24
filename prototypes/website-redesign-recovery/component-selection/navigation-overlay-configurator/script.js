(() => {
  const form = document.querySelector("#navForm");
  const desktop = document.querySelector(".preview-desktop .site-frame");
  const mobile = document.querySelector(".preview-mobile .site-frame");
  const previews = [desktop, mobile];
  const lockButton = document.querySelector("#lockButton");
  const resetButton = document.querySelector("#resetButton");
  const output = document.querySelector("#selectionReadout");
  const shell = document.querySelector(".review-shell");
  const storageKey = "mindmake-navigation-overlay-combination-v1";
  const defaults = Object.fromEntries(new FormData(form).entries());
  const labels = {structureDesktop:"Desktop structure",structureMobile:"Mobile structure",scaleDesktop:"Desktop link scale",scaleMobile:"Mobile link scale",densityDesktop:"Desktop density",densityMobile:"Mobile density",order:"Route order",secondary:"Secondary routes",active:"Active-route cue",action:"Start-here treatment",ground:"Overlay ground",entrance:"Entrance"};
  const baseOrder = ["Build your AI brain","Build your AI GTM","Results","Ideas","New-age leadership","Media"];
  const orders = {build:baseOrder,proof:["Results","Build your AI brain","Build your AI GTM","New-age leadership","Ideas","Media"],leadership:["New-age leadership","Build your AI brain","Build your AI GTM","Results","Ideas","Media"]};
  const read = () => Object.fromEntries(new FormData(form).entries());
  const applyOrder = (preview, key) => { const nav=preview.querySelector('.primary-routes'); const links=[...nav.querySelectorAll('a')]; const byText=new Map(links.map(link=>[link.textContent.trim(),link])); orders[key].forEach(text=>nav.append(byText.get(text))); };
  const apply = (state) => {
    desktop.dataset.structureDesktop=state.structureDesktop; desktop.dataset.scaleDesktop=state.scaleDesktop; desktop.dataset.densityDesktop=state.densityDesktop;
    mobile.dataset.structureMobile=state.structureMobile; mobile.dataset.scaleMobile=state.scaleMobile; mobile.dataset.densityMobile=state.densityMobile;
    previews.forEach(preview=>{preview.dataset.secondary=state.secondary;preview.dataset.active=state.active;preview.dataset.action=state.action;preview.dataset.ground=state.ground;preview.dataset.entrance=state.entrance;applyOrder(preview,state.order);});
  };
  const restore = (state) => { Object.entries(state).forEach(([name,value])=>{const target=form.elements.namedItem(name);if(!target)return;if(target instanceof RadioNodeList)target.value=value;else target.value=value;});apply(read()); };
  const renderLock = (state) => { const lines=Object.entries(labels).map(([key,label])=>`${label}: ${state[key]}`);lines.push(`Comment: ${state.comment?.trim()||"none"}`);output.innerHTML=`<strong>Saved locally</strong><br>${lines.join("<br>")}`;lockButton.textContent="Combination locked";shell.classList.add("is-locked"); };
  const hashFor = (state) => { const clean={...state};delete clean.comment;return new URLSearchParams(clean).toString(); };
  form.addEventListener("change",()=>{apply(read());shell.classList.remove("is-locked");lockButton.textContent="Lock this combination";});
  lockButton.addEventListener("click",()=>{const state=read();localStorage.setItem(storageKey,JSON.stringify(state));history.replaceState(null,"",`#${hashFor(state)}`);renderLock(state);});
  resetButton.addEventListener("click",()=>{localStorage.removeItem(storageKey);history.replaceState(null,"",location.pathname+location.search);form.reset();restore(defaults);output.textContent="";shell.classList.remove("is-locked");lockButton.textContent="Lock this combination";});
  let saved=null;try{saved=JSON.parse(localStorage.getItem(storageKey));}catch{saved=null}if(saved){restore(saved);renderLock(saved)}else apply(defaults);
})();
