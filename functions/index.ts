// functions/index.ts
export const onRequest: PagesFunction = async ({ request }) => {
  const acceptLanguage = request.headers.get('Accept-Language') ?? '';
  const primaryLang = acceptLanguage.split(',')[0].trim().toLowerCase();
  const locale = primaryLang.startsWith('zh') ? 'zh' : 'en';
  const url = new URL(request.url);
  return Response.redirect(`${url.origin}/${locale}/`, 302);
};
