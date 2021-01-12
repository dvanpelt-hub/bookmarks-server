const { v4: uuidv4 } = require('uuid');

const bookmarks = [
  {
    id: uuidv4(),
    title: "Fidelity",
    url: "https://www.fidelity.com",
    description: "fidelity investing site",
    rating: 5,
  },
  {
    id: uuidv4(),
    title: "Google",
    url: "https://www.google.com",
    description: "google website",
    rating: 5,
  },
  {
    id: uuidv4(),
    title: "Yahoo",
    url: "https://yahoo.com",
    description: "yahoo website",
    rating: 4,
  },
];

module.exports = { bookmarks };
