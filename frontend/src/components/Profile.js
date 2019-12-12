import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Auth from '../lib/auth'

import { UserContext } from './UserContext'

//Reggie: Weekend Work
/* Reggie: I created this page over the weekend for the project. Obviously Marissa will have something to say about styling, 
however I had to get my hands on some logic behind it. In this form, there is no need for an id in the path and the user's specific data is
only accessible by the logged in user. It's up to us to decide what to display.*/

const Profile = () => {
  // I've initialised our state with an object
  const [data, setData] = useState({})
  const [info, setInfo] = useState({})
  const [update, setUpdate] = useState(false)

  const { userInfo, setUserInfo } = useContext(UserContext)

  /* In order to get the api to recognise the user as the backend logic dictates, i need to present the token received from the login process.
  Since we're working with local storage (see Auth class), at this point I retrieve the token from local storage and insert it into the 
  header in the bearer syntax */

  useEffect(() => {
    axios.get('/api/profile', {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(res => {
        const newData = res.data
        setData(newData)
        if (userInfo) {
          setInfo(userInfo)
        }
      })
      .catch(error => console.log(error))
    // .then(console.log(data))
  }, [userInfo])

  useEffect(() => {
    if (update) {
      axios.put('/api/profile/edit', info, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
        .then(res => {
          // console.log(res.data)
          // console.log(res.data.user)
          setUserInfo(res.data.user)
          setUpdate(false)
        })
        .catch(err => console.log(err))
    }
  }, [info])


  const removeFavRest = (e) => {
    let match = info.favouriteRestaurants
    const update = match.filter((rest) => {
      return rest.name !== e.target.attributes.getNamedItem('data-name').value
    })
    console.log(update)
    setInfo({ ...info, favouriteRestaurants: update })
    setUpdate(true)
    // console.log(update)  
  }
  
  const removeFavReci = (e) => {
    let match = info.favouriteRecipes
    const update = match.filter((reci) => {
      return reci.name !== e.target.attributes.getNamedItem('data-name').value
    })
    console.log(update)
    setInfo({ ...info, favouriteRecipes: update })
    setUpdate(true)
    // console.log(update)  
  }

  /* There's another oddity at this point. The render happens before the data is pulled and thus one of those conditional tricks is needed
  to get the data to show correctly. At a later stage, we can include a couple of loading styles to replace what at times can be blank load
  times.*/

  return (
    <div className="section">
      {console.log(info)}
      <div className="section">
        <div className="container">
          {/* <div className="columns is-multiline">
          <div className="column is-half-tablet"> */}
          {data.user && <p className="pro-title">
            Hey {data.user.username}
          </p>}
          {data.user && <div className="pro-subtitle">
            {data.user.email}
          </div>}
          <div className="pro-subtitle">
            {data.user && data.user.dietary.map((diet, id) =>
              <p key={id}>{diet}</p>
            )}
          </div>
          <div>
            <div className="pro-link">Quicklinks</div>
            <Link className="tag is-info is-light" to='/profile/edit'>Edit Profile</Link>
            <Link className="tag is-info is-light" to='/recipes'>Recipes</Link>
            <Link className="tag is-info is-light" to='/restaurants'>Restaurants</Link>
            <Link className="tag is-info is-light" to='/'>Food Focus</Link>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <h2>Favourite Restaurants</h2>
            <div className="columns is-multiline">
              {/* {data.user && data.user.favouriteRestaurants.map((eateries, id) =>
              <li className="tile is-child" key={id}>{eateries.image ? eateries.image[0] : eateries}</li>
            )} */}
              {data.user && data.user.favouriteRestaurants.map((rest, id) => {
                // console.log(rest.name)
                return (
                  <div key={id} className="column is-one-quarter-desktop">
                    <div className="card">
                      <h3 className="fav-title card-header-title is-centered"><Link className='fav-link' to={`/restaurants/${rest._id}`}>{rest.name}</Link></h3>
                      <p className="fav-sub">{rest.location}</p>
                      <div className="card-image">
                        <figure className="image is-4by3">
                          <img className="fav-image" src={rest.image[0]} />
                        </figure>
                      </div>
                      <footer className="card-footer">
                        <Link data-name={rest.name} onClick={removeFavRest} className="card-footer-item">Remove</Link>
                      </footer>
                    </div>
                  </div>)
              })}
            </div>
          </div>
          <div className="container">
            <h3>Favourite Recipes</h3>
            <div className="columns is-multiline">
              {data.user && data.user.favouriteRecipes.map((recipes, id) => {
                return (
                  <div key={id} className="column is-one-quarter-desktop">
                    <div className="card">
                      <h3 className="fav-title-recipe card-header-title is-centered"><Link className='fav-title-recipe' to={`/recipes/${recipes._id}`}>{recipes.name}</Link></h3>
                      <p className="fav-sub">{recipes.author}</p>
                      <div className="card-image">
                        <figure className="image is-4by3">
                          <img className="fav-image" src={recipes.image[0]} />
                        </figure>
                      </div>
                      <footer className="card-footer">
                        <Link data-name={recipes.name} onClick={removeFavReci} className="card-footer-item">Remove</Link>
                      </footer>
                    </div>
                  </div>)
              })}
            </div>
          </div>
          {/* </div>
        </div> */}
        </div>
      </div>
    </div>
  )
}


export default Profile