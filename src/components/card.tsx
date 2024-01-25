import { project } from "../pages/project";

export default function Card(props:project) {
  return (
    <div className="card w-60 bg-base-100 shadow-xl mx-[1.5px] mb-2">
      <figure><img src={props.image} alt="Shoes" /></figure>
      <div className="card-body">
        <h2 className="card-title">
          {props.title}
        </h2>
        <p>{props.description}</p>
        <div className="card-actions justify-end">
          {props.tag.map((tag) => (
            <div className="badge badge-outline pb-1">{tag}</div>
          ))}
        </div>
      </div>
    </div>
  )
}