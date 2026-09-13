// imports and some other code ...
const flowerUrl =
  "https://images.pexels.com/photos/39207267/pexels-photo-39207267.jpeg";

// this could be a new file !! 🫠

// type ArticleProps = {
// YOU NEED TO DEFINE THE TYPE FOR THE PROPS PASSED TO ArticleComp
// };

// article component
const ArticleComp = ({ title, description, image }: any) => {
  const imageStyles = {
    width: "100px",
    height: "100px",
  };

  return (
    <article style={{ border: "1px solid grey", padding: "0.5em" }}>
      <h2>{title}</h2>
      <img src={image} alt={title} style={imageStyles} />
      <p>{description}</p>
    </article>
  );
};

// app file

const App = () => {
  const articlesList = [
    {
      title: "Article 1",
      description: "Description 1",
      image:
        "https://images.pexels.com/photos/39207267/pexels-photo-39207267.jpeg",
    },
    {
      title: "Article 2",
      description: "Description 2",
      image:
        "https://images.pexels.com/photos/8747817/pexels-photo-8747817.jpeg",
    },
    {
      title: "Article 3",
      description: "Description 3",
      image:
        "https://images.pexels.com/photos/9374220/pexels-photo-9374220.jpeg",
    },
  ];

  return (
    <div>
      <h1>My App</h1>
      <main style={{ display: "flex", gap: "1em" }}>
        <ArticleComp />
      </main>
    </div>
  );
};

export default App;
