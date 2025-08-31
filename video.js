// Aislamiento de la lógica del video para evitar conflictos
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('videoPlayer', {
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  playVideoOnScroll();
  window.addEventListener('scroll', playVideoOnScroll);
}

function playVideoOnScroll() {
  const video = document.getElementById('videoPlayer');
  if (!video || !player) return;

  const rect = video.getBoundingClientRect();
  const isVisible = (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );

  if (isVisible && player.getPlayerState() !== YT.PlayerState.PLAYING) {
    player.playVideo();
  }
}