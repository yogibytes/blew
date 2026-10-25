import Head from 'next/head'
import { BlewLanding } from '@/components/BlewLanding'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Blew — Crypto Payments Without the Friction</title>
        <meta
          name="description"
          content="Accept SOL and USDC payments with developer-first payment infrastructure."
        />
      </Head>
      <BlewLanding />
    </>
  )
}
