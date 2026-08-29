/**
 * Personal email providers, the browser's copy.
 *
 * The canonical list lives in `supabase/functions/_shared/enrich/types.ts`,
 * where the pipeline uses it to degrade gracefully. The page needs the same
 * answer before it sends anything, and the browser cannot import from an edge
 * function, so this is a copy and `src/test/work-email.test.ts` fails the build
 * if the two ever differ.
 */

export const FREE_EMAIL_DOMAINS = new Set([
  // The global ones.
  'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'rocketmail.com',
  'hotmail.com', 'outlook.com', 'live.com', 'msn.com', 'passport.com',
  'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'aim.com',
  'proton.me', 'protonmail.com', 'pm.me',
  'gmx.com', 'gmx.net', 'gmx.de', 'mail.com', 'email.com', 'usa.com',
  'zoho.com', 'zohomail.com', 'yandex.com', 'yandex.ru', 'tutanota.com',
  'tuta.com', 'fastmail.com', 'fastmail.fm', 'hushmail.com', 'mailfence.com',
  // Regional providers with large personal bases.
  'hotmail.co.uk', 'hotmail.fr', 'hotmail.it', 'hotmail.es', 'hotmail.de',
  'live.co.uk', 'live.com.au', 'live.ca', 'live.nl', 'live.fr',
  'outlook.com.au', 'outlook.co.uk', 'outlook.fr', 'outlook.de', 'outlook.es',
  'yahoo.co.uk', 'yahoo.com.au', 'yahoo.ca', 'yahoo.co.in', 'yahoo.fr',
  'yahoo.de', 'yahoo.es', 'yahoo.it', 'yahoo.co.jp', 'yahoo.com.br',
  'btinternet.com', 'sky.com', 'virginmedia.com', 'talktalk.net', 'ntlworld.com',
  'bigpond.com', 'bigpond.net.au', 'optusnet.com.au', 'iinet.net.au',
  'orange.fr', 'wanadoo.fr', 'free.fr', 'laposte.net', 'sfr.fr',
  'web.de', 't-online.de', 'freenet.de', 'libero.it', 'virgilio.it',
  'terra.com.br', 'uol.com.br', 'bol.com.br', 'naver.com', 'daum.net',
  'qq.com', '163.com', '126.com', 'sina.com', 'rediffmail.com',
  'shaw.ca', 'rogers.com', 'sympatico.ca', 'telus.net',
  'comcast.net', 'verizon.net', 'att.net', 'sbcglobal.net', 'bellsouth.net',
  'cox.net', 'charter.net', 'earthlink.net', 'juno.com', 'netzero.net',
  // Disposable and throwaway.
  'mailinator.com', 'guerrillamail.com', 'yopmail.com', '10minutemail.com',
  'temp-mail.org', 'trashmail.com', 'sharklasers.com', 'dispostable.com',
  'maildrop.cc', 'getnada.com', 'throwawaymail.com', 'mailnesia.com',
]);