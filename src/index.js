let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
})

//! Global Variables
let toyCollection = document.getElementById("toy-collection")
const addNewToyForm = document.querySelector(".add-toy-form")

//! Helper Functions
const createToyCard = toy => {
  //create elements in HTML
  let toyCard = document.createElement("div")
  let toyName = document.createElement("h2")
  let toyImage = document.createElement("img")
  let toyLikes = document.createElement("p")
  let toyButton = document.createElement("button")
  

  //input values and add id/class and pulling json data
  toyCard.className = "card"
  toyName.textContent = toy.name
  toyImage.src = toy.image 
  toyImage.className = "toy-avatar"
  toyLikes.textContent = `${toy.likes} Likes` 
  toyButton.className = "like-btn"
  toyButton.id = toy.id
  toyButton.textContent = "Like ❤️"
  toyImage.alt = toy.name

  toyButton.addEventListener('click', e => {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({likes: ++toy.likes})
    })
    .then(response => response.json())
    .then(updatedLikes => {
      e.target.parentElement.querySelector("toyLikes").textContent = `${updatedLikes.likes} Likes`
    })
    .catch(error => alert(error))
  })

//append each toy and its elements to toy collection so can be loopable in forEach
  toyCard.append(toyName, toyImage, toyLikes, toyButton)
  toyCollection.append(toyCard)
}


//! Fetch all Toys
fetch("http://localhost:3000/toys")
.then(response => response.json())
.then(toys => toys.forEach(toy => createToyCard(toy)))
.catch(error => alert(error))

//! Start working on Toy Form
addNewToyForm.addEventListener("submit", e => {
  e.preventDefault()

  const name = e.target.name.value
  const image = e.target.image.value
  if (name.trim() && image.trim()) { //! If the user inputted data
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({name, image, likes:0})
    })
    .then(response => response.json())
    .then(newToyCreated => {createToyCard(newToyCreated) //! make sure you use the to from the second then it needs the id
    e.target.reset()
    })
    .catch(error => alert(error))
  }
  else {
    alert("Please fill out the whole form!")
  }
})
