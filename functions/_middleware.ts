export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  if (url.pathname === '/baidu_verify_codeva-PS74V0QACA.html') {
    return new Response('704fd8a31d130cb2af1a8503f93965bd', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  return context.next();
};
