/**
 * Provider configuration for CLE/CE accreditation artifacts.
 * All values are PLACEHOLDERS until the provider sets them via env vars.
 * A provider must obtain a provider/sponsor number from each accrediting board
 * before applying — these fields exist so the certificate and submission packet
 * populate correctly once that is in hand.
 */
export const PROVIDER = {
  name: import.meta.env.VITE_PROVIDER_NAME ?? "[Your organization name]",
  providerNumber:
    import.meta.env.VITE_PROVIDER_NUMBER ??
    "[Provider/sponsor number — obtain from each accrediting board]",
  author: import.meta.env.VITE_COURSE_AUTHOR ?? "[Author / faculty name]",
  authorQuals:
    import.meta.env.VITE_COURSE_AUTHOR_QUALS ??
    "[Author qualifications, credentials, and relevant experience]",
  contact: import.meta.env.VITE_PROVIDER_CONTACT ?? "[Provider contact email]",
};
