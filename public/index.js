// const edits = document.querySelectorAll('.edit-btn');

// edits.forEach((edit)=>{
//     edit.addEventListener("click",(e)=>{
//         e.preventDefault();
//         let taskForm = this.closest(".taskform");

//         let book_title = taskForm.querySelector('.title-head')
//         let book_author = taskForm.querySelector('.author')
//         let book_rating = taskForm.querySelector()
//         let book_review = taskForm.querySelector(".review");
//         let deleteButton = taskForm.querySelector(".delete");
//         let doneButton = taskForm.querySelector(".done");

//         // Enable editing, add border, and focus on the input field
//         taskInput.removeAttribute("disabled");
//         taskInput.style.border = "2px solid #007bff"; // Add border
//         taskInput.focus();

//         // Move cursor to the end of the text
//         let val = taskInput.value;
//         taskInput.value = "";
//         taskInput.value = val;

//         // Hide edit & delete buttons, show the done button
//         // this.style.display = "none"; // Hide Edit button
//         this.style.display = 'none';
//         deleteButton.style.display = "none"; // Hide Delete button
//         doneButton.style.display = "inline-block"; // Show Done button
//     })
// })

const search = document.querySelector(".search-box");

search.addEventListener("keydown",(e)=>{
    console.log(e.key);
})