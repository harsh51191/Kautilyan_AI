/* Google Drive + YouTube URL normalization for blog media */
(function (global) {
  'use strict';

  var ALLOWED_HOSTS = [
    'drive.google.com',
    'docs.google.com',
    'lh3.googleusercontent.com',
    'lh4.googleusercontent.com',
    'lh5.googleusercontent.com',
    'lh6.googleusercontent.com',
    'youtube.com',
    'www.youtube.com',
    'youtu.be',
    'i.ytimg.com',
    'img.youtube.com',
  ];

  function isAllowedUrl(url) {
    try {
      var u = new URL(url);
      if (u.protocol !== 'https:') return false;
      return ALLOWED_HOSTS.some(function (h) {
        return u.hostname === h || u.hostname.endsWith('.' + h);
      });
    } catch (e) {
      return false;
    }
  }

  function extractDriveId(url) {
    var m = /\/file\/d\/([a-zA-Z0-9_-]+)/.exec(url);
    if (m) return m[1];
    m = /[?&]id=([a-zA-Z0-9_-]+)/.exec(url);
    if (m) return m[1];
    m = /\/d\/([a-zA-Z0-9_-]+)/.exec(url);
    return m ? m[1] : null;
  }

  function extractYouTubeId(url) {
    var m = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/.exec(url);
    return m ? m[1] : null;
  }

  function normalizeImageUrl(url) {
    if (!url) return '';
    url = String(url).trim();
    var driveId = extractDriveId(url);
    if (driveId) {
      return 'https://drive.google.com/uc?export=view&id=' + driveId;
    }
    if (isAllowedUrl(url)) return url;
    return '';
  }

  function driveThumbnailUrl(id, size) {
    if (!id) return '';
    size = size || 'w1200';
    return 'https://drive.google.com/thumbnail?id=' + id + '&sz=' + size;
  }

  function normalizeVideoEmbed(url) {
    if (!url) return { kind: '', embed: '', openUrl: '' };
    url = String(url).trim();
    var yt = extractYouTubeId(url);
    if (yt) {
      return {
        kind: 'youtube',
        embed: 'https://www.youtube-nocookie.com/embed/' + yt + '?rel=0',
        openUrl: 'https://www.youtube.com/watch?v=' + yt,
        id: yt,
      };
    }
    var driveId = extractDriveId(url);
    if (driveId) {
      var viewUrl = 'https://drive.google.com/file/d/' + driveId + '/view';
      return {
        kind: 'drive',
        embed: 'https://drive.google.com/file/d/' + driveId + '/preview',
        openUrl: viewUrl,
        thumbnail: driveThumbnailUrl(driveId),
        id: driveId,
      };
    }
    if (/youtube-nocookie\.com\/embed\//.test(url) && isAllowedUrl(url)) {
      return { kind: 'youtube', embed: url, openUrl: url };
    }
    return { kind: '', embed: '', openUrl: '' };
  }

  global.BlogMedia = {
    isAllowedUrl: isAllowedUrl,
    normalizeImageUrl: normalizeImageUrl,
    normalizeVideoEmbed: normalizeVideoEmbed,
    driveThumbnailUrl: driveThumbnailUrl,
    extractDriveId: extractDriveId,
    extractYouTubeId: extractYouTubeId,
  };
})(typeof window !== 'undefined' ? window : this);
