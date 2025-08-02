import { Hero } from "./landing-page/hero"
import { Demo } from "./landing-page/demo"
import { Header } from "./landing-page/header"

export default function Home() {
  return (
    <div className="h-dvh w-dvw bg-linear-to-r from-fuchsia-300 via-fuchsia-200 md:via-fuchsia-100 to-fuchsia-300 overflow-hidden">
      <Header />
      <Hero />
      <Demo />
    </div>
  )
}
