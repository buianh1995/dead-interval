export const siteUrl = import.meta.env.PUBLIC_SITE_URL?.trim();
export const username = import.meta.env.PUBLIC_BUTTONDOWN_USERNAME?.trim();
export const privacyContact = import.meta.env.PUBLIC_PRIVACY_CONTACT?.trim();
export const isPublic = import.meta.env.PUBLIC_ARCHIVE_PUBLIC === 'true';

export function checkPublishingConfig() {
  if (siteUrl) {
    const url = new URL(siteUrl);
    if (url.protocol !== 'https:' || url.origin !== siteUrl.replace(/\/$/, '')) {
      throw new Error('PUBLIC_SITE_URL must be an HTTPS origin.');
    }
  }
  if (username && !/^[a-zA-Z0-9_-]+$/.test(username)) throw new Error('Invalid Buttondown username.');
  if (privacyContact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(privacyContact)) throw new Error('Invalid privacy contact.');
  if (isPublic && (!siteUrl || !username || !privacyContact)) {
    throw new Error('Public builds require the canonical origin, Buttondown username and privacy contact.');
  }
}

export function absolute(path: string) {
  return siteUrl ? new URL(path, siteUrl).href : path;
}

