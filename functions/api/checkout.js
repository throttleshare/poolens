const LINKS = {
  monthly: 'https://buy.stripe.com/7sY7sE2aIaq31cE5EF8AE0O',
  yearly: 'https://buy.stripe.com/aFa28k9Da69NdZq3wx8AE0P',
  annual: 'https://buy.stripe.com/aFa28k9Da69NdZq3wx8AE0P',
};

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const plan = (url.searchParams.get('plan') || 'monthly').toLowerCase();
  const target = LINKS[plan] || LINKS.monthly;
  return Response.redirect(target, 302);
}
