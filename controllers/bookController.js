const Books = require('../models/bookModel');
const stripe = require('stripe')(process.env.paymentKey);


//add book
exports.addBook = async (req, res) => {
  console.log('inside  add book');
  console.log(req.body);
  const { title, author, noofpages, imageUrl, price,
    dprice, abstract, publisher, language, isbn, category } = req.body

  var userMail = req.payload

  var UploadedImages = []

  //   console.log(req.files);
  req.files.map((item) => UploadedImages.push(item.filename))
  console.log(title, author, noofpages, imageUrl, price,
    dprice, abstract, publisher, language, isbn, category, userMail, UploadedImages);

  try {
    const existingBook = await Books.findOne({ title, userMail })

    if (existingBook) {
      res.status(402).json({ message: "Book already existing...", existingBook })
    }
    else {
      const newBook = new Books({
        title, author, noofpages, imageUrl, price,
        dprice, abstract, publisher, language, isbn, category, userMail, UploadedImages
      })
      await newBook.save()
      res.status(200).json({ message: "Book added Successfully..", newBook })
    }
  } catch (error) {
    res.status(402).json("error" + error)
  }


}

//get book

exports.getBooks = async (req, res) => {
  const userMail = req.payload

  console.log(req.query);
  console.log(req.query.search);
  const searchKey = req.query.search

  try {

    const query = searchKey
      ? { title: { $regex: searchKey, $options: 'i' } }
      : {};
  console.log("userMail:", userMail)
  console.log("query:", query)


    const allBooks = await Books.find({ userMail: { $ne: userMail }, ...query })
    res.status(200).json(allBooks)
  } catch (error) {
    res.status(500).json("Server Error" + error)
  }
}

exports.getUserBook = async(req,res)=>{
  const userMail = req.payload
  try {
    const bookData = await Books.find({userMail})
    if(bookData.length>0){
      res.status(200).json({message:"Book details",bookData})
    }
    else{
      res.status(401).json({message:'No Books added'})
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.getpurchaseDetails = async(req,res)=>{
  const userMail = req.payload
  try {
    const boughtData = await Books.find({brought:{$eq:userMail}})
  if(boughtData.length>0){
      res.status(200).json(boughtData)
  }
  else{
    res.status(401).json({message:"No purchase yet"})
  }
  } catch (error) {
    res.status(200).json(error)
  }
}
exports.getHomeBooks = async (req, res) => {
  try {
    const allBooks = await Books.find().sort({ _id: -1 }).limit(4)
    res.status(200).json(allBooks)
  } catch (error) {
    res.status(500).json("Server Error" + error)
  }
}

//view Book

exports.viewBook = async (req, res) => {
  console.log(req.params); //{ id: '695ec1d8c36de4d251ba02ba' }
  const { id } = req.params
  try {
    const viewBook = await Books.findOne({ _id: id })
    res.status(200).json(viewBook)

  } catch (error) {
    res.status(500).json("Server Error" + error)
  }
}

//buy book
exports.buyBook = async (req, res) => {
  console.log("inside Payment");
  const { bookDetails } = req.body
  email = req.payload.userMail
  try {

    const existingBook = await Books.findByIdAndUpdate(bookDetails._id, {
      title: bookDetails.title,
      author: bookDetails.author,
      noofpages: bookDetails.noofpages,
      imageUrl: bookDetails.imageUrl,
      price: bookDetails.price,
      dprice: bookDetails.dprice,
      abstract: bookDetails.abstract,
      publisher: bookDetails.publisher,
      language: bookDetails.language,
      isbn: bookDetails.isbn,
      category: bookDetails.category,
      UploadedImages: bookDetails.UploadedImages,
      status: "sold",
      userMail: bookDetails.userMail,
      brought: bookDetails.brought,
    }, { new: true })

    console.log("dprice:", bookDetails.dprice);
    console.log("converted price:", Number(bookDetails.dprice) * 100);

    //create session
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: bookDetails.title,
            description: `${bookDetails.author} | ${bookDetails.publisher} | ${bookDetails.abstract}`,
            images: [bookDetails.imageUrl],
            metadata: {
              title: bookDetails.title,
              author: bookDetails.author,
              noofpages: bookDetails.noofpages,
              imageUrl: bookDetails.imageUrl,
              price: bookDetails.price,
              dprice: bookDetails.dprice,
              publisher: bookDetails.publisher,
              language: bookDetails.language,
              isbn: bookDetails.isbn,
              category: bookDetails.category,
              UploadedImages: bookDetails.UploadedImages.join(","),
              status: "sold",
              userMail: bookDetails.userMail,
              brought: email,
            },
          },
          unit_amount: Math.round(Number(bookDetails.dprice)),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: 'http://localhost:5173/payment-success',
      cancel_url: 'https://bookstore-frontend-rcqu.vercel.app/payment-error',
      line_items,
      mode: 'payment',
    });
   
    
     
    res.status(200).json({ message: "success", sessionID: session.id, session })
  } catch (error) {
    res.status(500).json("Payment Error" + error)
  }

}


exports.afterPayment =async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);

    res.json({
      email: session.brought?.email,
      book: session.metadata,
      amount: session.amount_total
    });

  } catch (err) {
    res.status(500).json(err);
  }
}