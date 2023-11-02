function App() {
  const [quote, setQuote] = React.useState({
    quote: "Случайный генератор цитат. Моё первое приложение на React",
    author: "Виталий Тутаев",
  });
  const [origQuote, setOrigQuote] = React.useState({
    quote: "Random Quote Machine. This is my first React App!",
    author: "Tutaev Vitaly",
  });
  const [color, setColor] = React.useState("gray");

  let twitterLink =
    "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=";
  let tumblrLink =
    "https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=";

  function changeColor() {
    const colors = [];
    for (let i = 0; i < 3; i++) colors.push(Math.floor(Math.random() * 255));
    return `RGB(${colors[0]},${colors[1]},${colors[2]})`;
  }

  function viewOrigQuote() {
    setQuote((prev) => {
      return { ...prev, quote: origQuote.quote, author: origQuote.author };
    });
  }

  function nextQuote() {
    const url = "https://api.api-ninjas.com/v1/quotes?category=";
    const options = {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
        "X-Api-Key": "",
      },
    };

    getData(url, options).then((res) => {
      const newColor = changeColor();
      setColor(newColor);
      setOrigQuote({ quote: res[0].quote, author: res[0].author });
      translateOtherAPI(res[0]).then((result) => {
        const translatedText = result.replace(/\|.+/, "");
        const translatedAuthor = result.replace(/.+\|/, "");

        setQuote((prev) => {
          return { ...prev, quote: translatedText, author: translatedAuthor };
        });
      });
    });
  }

  async function translateOtherAPI(q) {
    const url = `https://translated-mymemory---translation-memory.p.rapidapi.com/get?langpair=en%7Cru&q=${q.quote}|${q.author}&mt=1&onlyprivate=0&de=a%40b.c`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "",
        "X-RapidAPI-Host":
          "translated-mymemory---translation-memory.p.rapidapi.com",
      },
    };

    try {
      const result = await getData(url, options);
      return result.responseData.translatedText;
    } catch (error) {
      console.error(error);
    }
  }

  async function getData(url, options) {
    const res = await fetch(url, options);
    const json = await res.json();
    return json;
  }

  twitterLink += encodeURIComponent('"' + quote.quote + '" ' + quote.author);
  tumblrLink +=
    encodeURIComponent(quote.author) +
    "&content=" +
    encodeURIComponent(quote.quote) +
    "&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button";

  return (
    <div style={{ backgroundColor: color }} id="body">
      <div id="quote-box">
        <div id="content">
          <h2 style={{ color: color }}>{quote.quote}</h2>
          <h3 style={{ color: color }}>{quote.author}</h3>
          <div className="buttons">
            <a
              style={{ backgroundColor: color }}
              id="tweet-quote"
              href={twitterLink}
              target="_blank"
            >
              <i className="fa fa-twitter"></i>
            </a>
            <a
              style={{ backgroundColor: color }}
              id="tumblr-quote"
              href={tumblrLink}
              target="_blank"
            >
              <i className="fa fa-tumblr"></i>
            </a>
            <button
              style={{ backgroundColor: color }}
              id="new-quote"
              onClick={nextQuote}
            >
              Новая цитата
            </button>
          </div>
          <button
            style={{ backgroundColor: color }}
            id="orig-quote"
            onClick={viewOrigQuote}
          >
            Оригинал цитаты
          </button>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
