let secret_idx = -1;
let secret_key = "";
let highlighted = null;
let pts = 0;

window.onload = () => {
  // event listeners
  assignKeysToAudios();

  // pick a new secret piano-key for guessing
  // renewSecret();
  let renew_secret = document.getElementById("renew-secret");
  renew_secret.onclick = renewSecret;

  // play secret clicked
  let play_secret = document.getElementById("play-secret");
  play_secret.onclick = (event) => {
    // console.log(`secret_idx = ${secret_idx}`);
    // console.log(`secret_idx = ${secret_key}`);
    if (secret_idx == -1) {
      return;
    }

    let audios = document.getElementsByClassName("audios")[0] || null;
    audio = audios.children[secret_idx] || null;

    if (audio == null) {
      console.log("error: audio is null");
      return;
    }

    // audio.currentTime = 0;
    // audio.play();

    let audio_obj = new Audio(audio.src);
    audio_obj.play();
  }

  // guess clicked
  // let guess = document.getElementById("guess");
  // guess.onclick = (event) => {
  //   if (highlighted.dataset.key != null && secret_key != null &&
  //     highlighted.dataset.key == secret_key) {
  //     pts += 10;
  //   } else {
  //     pts -= 5;
  //   }

  //   let pts_elm = document.getElementById("points");
  //   pts_elm.innerHTML = pts;
  // }

  // shortcuts for piano-keys
  document.onkeydown = (event) => {
    let shortcuts = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j'];

    // piano-keys
    if (shortcuts.includes(event.key)) {
      let idx = shortcuts.indexOf(event.key);
      let octave = document.getElementsByClassName("octave")[0] || null;
      let li = octave.children[idx] || null;
      let btn = li.children[0] || null;

      if (btn == null) {
        console.log("error: btn to be clicked is null");
        return;
      }

      btn.dataset.via_shortcut = "true";
      btn.click();
    }
    else if (event.key == 'p') {
      let play_secret = document.getElementById("play-secret");
      play_secret.click();
    }
    else if (event.key == '=') {
      let check_secret = document.getElementById("check-secret");
      check_secret.click();
    }
    else if (event.key == 'ArrowRight') {
      let renew_secret = document.getElementById("renew-secret");
      renew_secret.click();
    }
    else if (event.key == 'Escape') {
      if (highlighted != null) {
        highlighted.classList.remove('highlight');
        highlighted = null;
      }
    }
  }
}

var renewSecret = () => {
  let indices = checkedIndices();
  secret_idx = randomAudioIndex(indices);
  let octave = document.getElementsByClassName('octave')[0] || null;

  // give hints for what might be secret-key
  for (let i = 0; i < octave.children.length; ++i) {
    if (indices.length == 0 || indices.includes(i)) {
      octave.children[i].classList.add('maybe-secret');
    } else {
      octave.children[i].classList.remove('maybe-secret');
    }
  }

  let audios = document.getElementsByClassName("audios")[0] || null;
  let secret_audio = audios.children[secret_idx] || null;
  secret_key = secret_audio.dataset.key;
  // console.log(`secret_key: ${secret_key}`)

  // play secret upon renew
  let audio_obj = new Audio(secret_audio.src);
  audio_obj.play();
}

var compareHighlightedToSecret = () => {

}

// randomly pick audio for a piano-key
var randomAudioIndex = (indices) => {
  // if no checkbox selected
  if (indices.length == 0) {
    let octave = document.getElementsByClassName("octave")[0] || null;
    return Math.floor(Math.random() * octave.children.length);
  }

  rand_idx_idx = Math.floor(Math.random() * indices.length);
  return indices[rand_idx_idx];
}

// indices for checked piano-keys
var checkedIndices = () => {
  let octave = document.getElementsByClassName("octave")[0] || null;
  let indices = [];

  for (let i = 0; i < octave.children.length; ++i) {
    check = octave.children[i].getElementsByTagName("input")[0] || null;
    if (check != null && check.checked) {
      indices.push(i);
    }
  }

  return indices;
}

// set onclick event listeners for piano-keys
var assignKeysToAudios = () => {
  let octave = document.getElementsByClassName("octave");
  octave = octave[0] || null;

  let audios = document.getElementsByClassName("audios");
  audios = audios[0] || null;

  if (octave == null || audios == null) {
    console.log("error: octave or audios not found")
    return;
  }

  Array.from(octave.children).forEach((li, idx) => {
    let btn = li.children[0] || null;
    let audio = audios.children[idx] || null;

    if (audio == null || btn == null) {
      console.log("error: octave vs audios length mismatch, or button child missing")
      return;
    }

    btn.onclick = (event) => {
      if (highlighted != null) {
        highlighted.classList.remove('highlight');
      }

      if (event.target.dataset.via_shortcut == "true") {
        highlighted = event.currentTarget;
        highlighted.classList.add('highlight');
      } else {
        highlighted = null;
      }

      audio.currentTime = 0;
      audio.play();
      event.target.dataset.via_shortcut = "false";
    }
  })
}