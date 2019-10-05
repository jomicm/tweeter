/*eslint-env jquery*/
// eslint-disable-next-line no-undef
$(document).ready(function() {
  const input = $('.input-tweet');
  //const counter = input.parents().find('.counter');
  input.on('input', e => {
    const counter = $(e.target).parents().find('.counter');
    const msgLength = e.target.value.length;
    const newCount = 140 - msgLength;
    counter.html(newCount);
    if (newCount < 0) {
      counter.css('color', 'red');
      // const noSound = new Audio("http://soundbible.com/mp3/Computer%20Error%20Alert-SoundBible.com-783113881.mp3");
      const noSound = new Audio("http://soundbible.com/mp3/Pew_Pew-DKnight556-1379997159.mp3");
      noSound.play();
    } else counter.css({color:'black'});
  });
});