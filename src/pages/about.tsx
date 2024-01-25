import { useEffect } from "react"

export default function About() {

  useEffect(() => {
    document.title = "About | Ikhlashmulya"
  }, [])

  const logo = [
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-plain.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  ];

  return (
    <div className="min-h-screen flex flex-col w-[60%] mx-auto mb-10">
      <div>
        <h1 className="text-4xl font-bold mb-5 mt-10">About Me</h1>
        <p className="text-lg">Hi, I am Ikhlash Mulyanurahman a passionate and dedicated software developer specializing in backend development. With a keen interest in creating efficient and scalable solutions, I take pride in ensuring high-performance and reliable applications.</p>
        <p className="text-lg">I am always eager to stay updated with the latest trends and technologies. I believe in continuous learning and improvement to deliver cutting-edge solutions. On good days, I love to explore about technology especially on programming.</p>
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-5 mt-10">My Tech Stack</h1>
        <p className="text-lg mb-5">Here's the Technologies I've been working with recently</p>
        <div className="flex flex-row flex-wrap">
          {logo.map((value) => (
            <div className="w-28 h-28 rounded-lg border-2 border-solid border-gray-600 p-1 m-1 hover:scale-105 hover:shadow-2xl">
              <img src={value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}