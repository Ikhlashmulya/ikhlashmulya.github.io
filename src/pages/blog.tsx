import { useEffect } from "react"

export default function Blog() {

  useEffect(() => {
    document.title = "Blog | Ikhlashmulya"
  }, [])

  return (
    <div className="min-h-screen flex flex-col lg:w-[60%] mx-auto mb-10">
      <h1 className="text-4xl font-bold mb-5 mt-10">Blog</h1>
      <p className="text-lg">coming soon..</p><br />
    </div>
  )
}