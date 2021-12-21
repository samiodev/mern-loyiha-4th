import { useState, useEffect } from "react";

export default function HomeSideBar() {
  const [profile, setProfile] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/mypost", {
      headers: {
        Authorization: "Sammi " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result.myPost);
      });
  });
  return (
    <>
    {profile.map(item => {
        return (
          <div className="card" key={item._id}>
            <div className="card-image">
              <img src={item.photo} alt={item._id} />
            </div>
            <div className="card-content">
              <p className="card-title postedBy">{item.postedBy.name}</p>
              <b>{item.title}</b>
              <p>{item.body}</p>
            </div>
          </div>
        );
    })}
    </>
  );
}
