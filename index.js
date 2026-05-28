import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",   // "db" in Docker, "localhost" locally
  database: process.env.DB_NAME || "book_library",
  password: process.env.DB_PASSWORD || "Amit@8085",
  port: process.env.DB_PORT || 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/", async (req, res) => {
  const result = await db.query(`SELECT books.id, books.book_id, books.title,books.author,books.favourite, reviews.review, TO_CHAR(reviews.review_date, 'Dy Mon DD YYYY') AS review_date, reviews.rating FROM books JOIN reviews ON books.book_id = reviews.book_id ORDER BY books.id`);

  const data = result.rows;
  // console.log(data);
  res.render("index.ejs", { data });
});


app.get('/remove-favourite',async(req,res)=>{
  // console.log(req.query);
  await db.query("UPDATE books SET favourite = $1 WHERE book_id = $2",[false,req.query.book_id]);
  res.redirect('/');
})

app.get('/add-favourite',async(req,res)=>{
  // console.log(req.query);
  await db.query("UPDATE books SET favourite = $1 WHERE book_id = $2",[true,req.query.book_id]);
  res.redirect('/');
})

app.get('/delete/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const bookResult = await db.query("SELECT book_id FROM books WHERE id = $1", [id]);

  if (bookResult.rows.length === 0) {
    return res.status(404).send("Book not found");
  }

  const book_id = bookResult.rows[0].book_id;
  await db.query("DELETE FROM reviews WHERE book_id = $1", [book_id]);
  await db.query("DELETE FROM books WHERE id = $1", [id]);
  res.redirect('/');
});

app.get('/favourites',async(req,res)=>{
  const result = await db.query(`SELECT books.id, books.book_id, books.title,books.author,books.favourite, reviews.review, TO_CHAR(reviews.review_date, 'Dy Mon DD YYYY') AS review_date, reviews.rating FROM books JOIN reviews ON books.book_id = reviews.book_id where books.favourite = true ORDER BY books.id`);

  const data = result.rows;
  // console.log(data);
  res.render("index.ejs", { data });
})

app.get('/sortby',async(req,res)=>{
  // console.log(req.query);
  const sortBy = req.query.sort;
  let result;
  if(sortBy =='Title'){
    result = await db.query(`SELECT books.id, books.book_id, books.title,books.author,books.favourite, reviews.review, TO_CHAR(reviews.review_date, 'Dy Mon DD YYYY') AS review_date, reviews.rating FROM books JOIN reviews ON books.book_id = reviews.book_id ORDER BY books.title`);
  }
  else if(sortBy == "Rating"){
    result = await db.query(`SELECT books.id, books.book_id, books.title,books.author,books.favourite, reviews.review, TO_CHAR(reviews.review_date, 'Dy Mon DD YYYY') AS review_date, reviews.rating FROM books JOIN reviews ON books.book_id = reviews.book_id ORDER BY reviews.rating`);
  }
  else{
    result = await db.query(`SELECT books.id, books.book_id, books.title,books.author,books.favourite, reviews.review, TO_CHAR(reviews.review_date, 'Dy Mon DD YYYY') AS review_date, reviews.rating FROM books JOIN reviews ON books.book_id = reviews.book_id ORDER by reviews.review_date`);
  }
  
  const data = result.rows;
  // console.log(data);
  res.render("index.ejs", { data });
})

app.get("/edit/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  // console.log(id);
  const result = await db.query(
    "SELECT books.book_id,title,author, reviews.review, reviews.rating FROM books JOIN reviews ON books.book_id = reviews.book_id WHERE books.id = $1",
    [id]
  );

  // console.log(result.rows); // Check what it returns

  if (result.rows.length > 0) {
    const data = result.rows[0]; // ✅ Get the first object from the array
    res.render("edit.ejs", { data });
  } else {
    res.status(404).send("Book not found");
  }
});

app.post("/update", async (req, res) => {
  const book_id = req.body;
  console.log("Form Data: ",book_id);
  await db.query(
    "UPDATE reviews SET review = $1, review_date = $2, rating = $3 WHERE book_id = $4",
    [book_id.review, getDate(), book_id.rating, book_id.B_ID]
  );
  await db.query("UPDATE books SET title = $1,author = $2 WHERE book_id = $3", [
    book_id.title,
    book_id.author,
    book_id.B_ID,
  ]);
  res.redirect("/");
});


app.get('/new',(req,res)=>{
  res.render("new-book.ejs");
})

app.post('/add-new-book',async(req,res)=>{
  const form_data = req.body;
  console.log("New Book Data",req.body);

  await db.query("INSERT INTO books(book_id, title) VALUES($1, $2)", 
    [form_data.Book_Id, form_data.title]);

  await db.query("INSERT INTO reviews(book_id, review, review_date, rating) VALUES($1, $2, $3, $4)", 
      [form_data.Book_Id, form_data.review, getDate(), Number(form_data.rating)]);
  
  res.redirect('/');
})

app.listen(port, () => {
  console.log(`Server is Running at Port: ${port}`);
});





function getDate() {
  const date = new Date();

  console.log(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`)
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}
