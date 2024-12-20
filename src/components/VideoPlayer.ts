import Plyr from 'plyr';

export function initPlayer() {
  const players = Array.from(document.querySelectorAll('.plyr-video')).map(p => {
    const player = new Plyr(p, {
      debug: true,
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'fullscreen'
      ]
    });

    player.on('ready', () => {
      console.log('Player is ready');
    });

    player.on('error', (error) => {
      console.error('Plyr error:', error);
    });

    return player;
  });
} 