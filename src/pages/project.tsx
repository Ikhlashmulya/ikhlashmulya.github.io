import { useEffect } from "react"
import Card from "../components/card";

export interface project {
  title: string;
  description: string;
  image: string;
  tag: string[];
}

export default function Project() {

  useEffect(() => {
    document.title = "Project | Ikhlashmulya"
  }, [])

  const projectData: project[] = [
    {
      title: 'project 1',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
      tag: ['golang', 'gofiber']
    },
    {
      title: 'project 2',
      description: 'lorem ipsum dolor sit amet',
      image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
      tag: ['php', 'laravel']
    },
    {
      title: 'project 3',
      description: 'lorem ipsum dolor sit amet',
      image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
      tag: ['javascript', 'nodejs']
    },
  ]

  return (
    <div className="flex flex-col w-[60%] mx-auto mb-10">
      <h1 className="text-4xl font-bold my-10">Project</h1>
      <div className="flex flex-row flex-wrap">
        {projectData.map((data) => (
          <Card key={data.title} title={data.title} description={data.description} image={data.image} tag={data.tag} />
        ))}
      </div>
    </div>
  )
}