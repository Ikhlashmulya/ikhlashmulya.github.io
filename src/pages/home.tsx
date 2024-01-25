import { useEffect } from "react"
import SocialLink from "../components/social-link"

export default function Home() {

  useEffect(() => {
    document.title = "Home | Ikhlashmulya"
  }, [])

  return (
    <div className="hero min-h-screen bg-base-100 w-10/12 mx-auto">
      <div className="hero-content text-center lg:text-start flex-col lg:flex-row w-full justify-around">
        <img src="/images/me.jpeg" alt="me.jpeg" className="w-60 rounded-full border-2 border-gray-800" />
        <div>
          <h1 className="text-4xl font-bold">Hi There!👋</h1>
          <p className="py-6 text-lg"> My name is <b>Ikhlash Mulyanurahman</b>. A Software Developer from West Java, Indonesia.</p>
          <SocialLink />
          <a href="mailto:nurahmanmulya@gmail.com" className="btn mt-5">Contact Me</a>
        </div>
      </div>
    </div>
  )
}