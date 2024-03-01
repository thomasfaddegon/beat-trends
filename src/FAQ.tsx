import React from "react";

const FAQ = () => {
  return (
    <div className="max-w-3xl flex flex-col items-center self-center my-16">
      <h2 className="text-4xl font-bold mb-4">FAQs</h2>
      <p>
        <strong>
          Where did you get your data from? How did you build this?
        </strong>{" "}
        I created this graph app by first crafting a custom web scraper with
        Python and Selenium, capturing all the tracks from the Beatport Top 100
        on the first of each month for a decade. After collecting the data, I
        used Pandas to clean it up and organize it into JSONs. For the final
        touch, I combined React and D3.js to design the UI and visualize the
        data, making the app both informative and interactive.
      </p>
      <p>
        <strong>What is the Beatport Top 100?</strong>{" "}
        <a href="https://beatport.com">Beatport</a> is a website where dance
        music DJs can download new music, and the most downloaded songs are
        ranked on their "Top 100" list. Think of the Beatport Top 100 as the
        Billboard Hot 100 of dance music. While it's by no means representative
        of the entire electronic music scene, it is an excellent baseline for
        understanding the overall popularity of different genres over time.
      </p>
      <p>
        <strong>Beatport's genre classifications are inaccurate:</strong> I
        agree that they are not always perfect. Their recent division of techno
        into "Raw / Deep / Hypnotic" and "Peak-Time" is so laughably bad I
        condensed everything to just "Techno" for this graph. But overall, I
        find their labels to be pretty accurate, and tend to take way more issue
        with genre gatekeepers who love nothing more than condescendingly
        explaning why a track is not "real" techno.
      </p>
      <p>
        <strong>Is the data weighted in any way?</strong> Tracks were not given
        any preference for having a higher rank, and tracks were still counted
        if they were on the chart for multiple months.
      </p>
      <h2 className="text-4xl font-bold my-4">
        <a href="https://thomasfaddegon.dev">See more of my work!</a>
      </h2>
      <p></p>
    </div>
  );
};

export default FAQ;
