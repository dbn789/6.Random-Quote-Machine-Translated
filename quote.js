function App() {
  const [quote, setQuote] = React.useState({
    quote: "Random Quote Machine. This is my first React app!",
    author: "Vitaly Tutaev",
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

  function nextQuote() {
    const url = "https://api.api-ninjas.com/v1/quotes?category=";
    const options = {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
        "X-Api-Key": "W3EfE+evEFYdgmTbX459ZQ==UB8Ym2SjwsY9Qia8",
      },
    };

    getData(url, options).then((res) => {
      const newColor = changeColor();
      setColor(newColor);
      translateData(res[0]).then((data) => {
        if (data.status === 200) {
          setQuote({
            quote: data.translations[0].translated[0],
            author: res[0].author,
          });
        } else setQuote(res[0]);
      });
    });
  }

  async function translateData(phrase) {
    const url2 = "https://api.lecto.ai/v1/translate/text";
    const params = new URLSearchParams();
    params.append("to", "ru");
    params.append("from", "en");
    params.append("texts", phrase.quote);

    const options2 = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-API-key": "EH6WDH1-STRMT29-PEBA84K-7FDFSW5",
      },
      body: params,
    };
    const text = await getData(url2, options2);
    return text;
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
              New quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
