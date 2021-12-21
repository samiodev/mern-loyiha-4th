import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import Loader from "./Loader";

export default function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userId) : true
  );

  useEffect(() => {
    fetch(`http://localhost:5000/user/${userId}`, {
      headers: {
        Authorization: "Sammi " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
      });
  });

  const followUser = () => {
    fetch("http://localhost:5000/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Sammi " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("http://localhost:5000/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Sammi " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (s) => s !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {profile ? (
        <div className="profile">
          <div className="profileMain">
            <div>
              <img
                className="profileImg"
                src="https://images.unsplash.com/photo-1541534401786-2077eed87a74?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjd8fHBlcnNvbnxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                alt="profile"
              />
            </div>
            <div>
              <h4>{profile.user.name}</h4>
              <div className="infoProfile">
                <p>{profile.posts.length} posts</p>
                <p>{profile.user.followers.length} followers</p>
                <p>{profile.user.following.length} following</p>
              </div>
              <div>
                {showFollow ? (
                  <button
                    style={{ marginTop: 10 }}
                    className="btn #0d47a1 blue darken-4"
                    onClick={() => followUser()}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    style={{ marginTop: 10 }}
                    className="btn #0d47a1 blue darken-4"
                    onClick={() => unfollowUser()}
                  >
                    Un Follow
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="gallery">
            {profile.posts.map((item) => {
              return (
                <div key={item._id} className="img-item">
                  <img src={item.photo} alt={item._id} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
