import Link from 'next/link'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

type RouteContent = { title: string; intro: string; body: string[] }

const content: Record<string, RouteContent> = {
  product: { title: 'Crypto payments\nbuilt for the real world.', intro: 'Accept SOL and USDC with a checkout that feels native to your product.', body: ['A focused payment layer for teams that want crypto rails without crypto friction.', 'Create payment links, settle transactions, and keep your customer experience familiar.'] },
  developers: { title: 'Ship your first\ncrypto checkout.', intro: 'A small, predictable SDK designed for developers.', body: ['const payment = await blew.payments.create({', '  amount: 49, currency: “USDC”,', '  successUrl: “/success”', '})'] },
  pricing: { title: 'Simple pricing.\nRoom to grow.', intro: 'Prototype plans for every stage of building.', body: ['Starter       $0 / month', 'Pro           1% per transaction', 'Enterprise    Let’s talk'] },
  security: { title: 'Security without\nthe theater.', intro: 'Clear boundaries, careful defaults, and infrastructure designed to stay out of your way.', body: ['We do not invent certifications or make claims we cannot support. Every integration is built around least privilege and auditable events.'] },
  company: { title: 'Payments should\nfeel lighter.', intro: 'Blew is a small team building better crypto infrastructure.', body: ['We believe the best financial tools are quiet, fast, and understandable. Metrics on this page are prototype data.'] },
  docs: { title: 'Documentation', intro: 'Everything you need to accept SOL and USDC.', body: ['Getting started', 'Install the SDK, create a project, and generate your first payment in minutes.', 'Reference', 'Explore the API surface and webhook events.'] },
  dashboard: { title: 'Dashboard', intro: 'Your payment activity at a glance.', body: ['Volume                 $24,820', 'Successful payments     184', 'Conversion              72.4%', 'These are prototype analytics.'] },
  'get-started': { title: 'Get started\nwith Blew.', intro: 'A four-step path from zero to your first payment.', body: ['01  Create account', '02  Get API key', '03  Install SDK', '04  Create payment'] },
}

// `dashboard` is served by the dedicated pages/dashboard.tsx route, so it is not
// generated here to avoid a static/dynamic route collision.
const slugs = Object.keys(content).filter((slug) => slug !== 'dashboard')

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: slugs.map((slug) => ({ params: { slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<{ slug: string; page: RouteContent }> = async ({ params }) => {
  const slug = String(params?.slug)
  const page = content[slug] ?? content.docs
  return { props: { slug, page } }
}

export default function RoutePage({ slug, page }: { slug: string; page: RouteContent }) {
  return <main className="inner-page"><header className="inner-header"><Link href="/" className="inner-brand">Blew <span>☆</span></Link><Link href="/" className="back-link"><ArrowLeft /> Back home</Link></header><section className="inner-content"><p className="eyebrow">BLEW / {slug.toUpperCase()}</p><h1>{page.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1><p className="inner-intro">{page.intro}</p><div className="inner-body">{page.body.map((line) => <p key={line}>{line}</p>)}</div><Link href="/get-started" className="inner-cta">Start building <ArrowUpRight /></Link></section><footer className="inner-footer">© {new Date().getFullYear()} Blew. All rights reserved.</footer></main>
}
