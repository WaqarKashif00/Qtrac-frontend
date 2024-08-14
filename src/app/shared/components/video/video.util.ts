export function GetYoutubeEmbedURL(videoId: string): string {
  return 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&mute=1&showinfo=0&rel=0?version=3&loop=1&playlist=' + videoId;
}
