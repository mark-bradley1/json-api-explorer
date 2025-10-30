let posts = [];

const postList = document.getElementById("postList");
const fetchButton = document.getElementById("fetchButton");
const errorDiv = document.getElementById("error");
const postForm = document.getElementById("postForm");
const formError = document.getElementById("formError");
const formSuccess = document.getElementById("formSuccess");
const titleInput = document.getElementById("titleInput");
const bodyInput = document.getElementById("bodyInput");

function renderPosts() {
  for (let i = 0; i < posts.length; i++) {
    const newDiv = document.createElement("div");
    // generate html element, because we know what we are doing...
    const content = `
      <h3>${posts[i].title}</h3>
      <p>${posts[i].body}</p>`;
    newDiv.innerHTML = content;
    postList.appendChild(newDiv);
  }
}

document.addEventListener("click", function (event) {
  if (event.target.id === "fetchButton") {
    fetch("https://jsonplaceholder.typicode.com/posts").then((response) => {
      response.json().then((data) => {
        console.log(data);
        posts.push(...data);
        renderPosts();
      });
    });
  }
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  formError.textContent = "";
  formSuccess.textContent = "";

  const newPost = {
    title: titleInput.value.trim(),
    body: bodyInput.value.trim(),
    userId: 1,
  };

  if (!newPost.title || !newPost.body) {
    formError.textContent = "Please fill out both fields.";
    return;
  }

  try {
    formSuccess.textContent = "Sending post...";

    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    if (!response.ok) {
      throw new Error("Faild to create post.");
    }

    const data = await response.json();

    formSuccess.textContent = `Post created! ID: ${data.id}`;

    postForm.reset();
  } catch (error) {
    formError.textContent = `Error: ${error.message}`;
    formSuccess.textContent = "";
  }
});
