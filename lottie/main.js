let animationData = {"tgs":1,"v":"5.5.2","fr":30,"ip":0,"op":30,"w":512,"h":512,"nm":"rotate","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Shape Layer 1","sr":1,"ks":{"r":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":30,"s":[90]}]},"p":{"a":0,"k":[256,256,0]}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":3,"s":{"a":0,"k":[256,256]},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":0},"nm":"Rectangle Path 1","hd":false},{"ty":"fl","c":{"a":0,"k":[1,0,0,1]},"o":{"a":0,"k":100},"r":1,"bm":0,"nm":"Fill 1","hd":false},{"ty":"tr","p":{"a":0,"k":[0,-0.031]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0},"nm":"Transform"}],"nm":"Rectangle 1","bm":0,"hd":false}],"ip":0,"op":30,"st":0,"bm":0}]}


let anim;
const codeArea = document.getElementById("codeArea");
const animationArea = document.getElementById("animationArea");
const autoRefresh = document.getElementById("autoRefresh");
const messageArea = document.getElementById("messageArea");

codeArea.value = JSON.stringify(animationData, null, 2);
setAnimation();
codeArea.onchange = codeChange;
codeArea.onkeyup = codeChange;

function codeChange() {
  if (autoRefresh.checked) {
    setAnimation();
  }
}

function formatCode() {
  try {
    codeArea.value = JSON.stringify(JSON.parse(codeArea.value), null, "   ");
    hideMessage();
  } catch (e) {
    showMessage(e);
  }
}

function setAnimation() {
  try {
    animationData = JSON.parse(codeArea.value);
    animationArea.innerHTML = "";
    let animData = {
      container: animationArea,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData
    }
    anim = bodymovin.loadAnimation(animData);
    hideMessage();
  } catch (e) {
    showMessage(e);
  }
}

function showMessage(message) {
  messageArea.innerHTML = message;
  messageArea.style.opacity = 1;
}

function hideMessage() {
  messageArea.style.opacity = 0;
}