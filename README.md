## Technologies

- Through React, I've developed a user-friendly interface for the client. 
- WebSocket is utilized to receive real-time prices and news from the server.
- Deployed on [portalfinancechart.site](https://portalfinancechart.site)


## Description

The client has access to data on over 7,000 stocks from the American stock exchange. This comprehensive database empowers users with a vast array of investment options, enabling them to explore various sectors, industries, and companies. Through this extensive coverage, users can make informed decisions and diversify their investment portfolios effectively.

Moreover, users can actively engage in buying and selling stocks at market prices using virtual money. This feature not only facilitates hands-on experience in trading but also provides a risk-free environment for users to learn and practice investment strategies. By leveraging virtual funds, users can experiment with different investment approaches, refine their trading techniques, and gain valuable insights into the dynamics of the stock market without incurring any financial losses.

In addition to real-time trading capabilities, the project offers comprehensive historical reports to help clients track their financial performance over time. These reports provide valuable insights into past transactions, portfolio growth, and market trends, empowering users to assess their investment strategies and make informed decisions for the future.

Furthermore, users have the flexibility to personalize their profiles by adding favorite stocks to their watchlist. This feature allows users to monitor specific stocks closely, receive timely updates, and stay informed about market developments that may impact their investment decisions. By tailoring their watchlist to their individual preferences and investment goals, users can streamline their trading experience and stay focused on the stocks that matter most to them.

Overall, the project aims to provide users with a comprehensive and user-friendly platform for learning, practicing, and mastering the art of stock market investing. By offering access to extensive stock data, virtual trading capabilities, historical reports, and customizable features, the project empowers users to become more confident and successful investors in the ever-evolving world of finance.


# Functionalities

Each page has its own functionality and is divided into two parts: `Primul.js` + the respective page.
- **Primul.js**
   It is designed to provide information about the user through the function "getDataAboutUser" and to search for the desired symbol with the function "actualizamInput".
   
   You can customize your profile by adding a profile picture, this is possible with the function "selectamFila". You can do this because I store the photo on my private server. 
   This page is important because you can navigate to every page according to preferences.
  
   Most importantly, you can change the project's language, the language is stored in the application context, it is called: 'ContextLimbaAplicatiei'. I store the text for the language in a separate database.
  
   Another important aspect is that the user is also a context in the application and is called: `const [user, setUser] = React.useContext(ContextUser);`

- **diverse.js**
   This page full of code is very interesting.
  Through the function "reconectare", I try to reconnect to the server (where it provides prices directly for the entire application) with increasing seconds, increasing seconds are not directly equal to the offer and a variety of random seconds.
  I implemented this to not abuse the server and give it a breather, so it doesn't crash again.
  
   The function "trimitemArraySubscribe" sends the stocks that the user has on the page at that moment. I filter this because it's good for the site's performance, not to give it 7 thousand prices per second, I only give the ones the user is interested in, this seems ingenious to me and I'm convinced it helped a lot with performance.

   The function 'trimitemEroareaInNode' helps us send errors the client encounters to the server where a team can take care of seeing the error and resolving it or giving suggestions to the client.

- **LineChart.js**
  
   In this page, I return a chart for prices which I import on every page where I need a chart. Mostly I use it on pages where I need a chart with instant prices per second.
  I m using Lightweight Charts.

- **Notificare.js**
   In this code page, I receive important financial news through a WebSocket connection.
  This notification will appear on every page, but if you click on it, you can view it better.

- **Portofoliu.js**
   In this segment, the user can buy or sell, see the history, but especially statistics on their actions.
   Functions like "cumpara" (which checks and doesn't allow transactions if you don't have money, if you don't have money it gives you a warning), "sell" (a function with which you sell, I cannot make the sale if the quantity is not entered correctly), "addMoney" (adds virtual money to the user's account).


## Screenshots

- **Home Page**
  ![Home Page Screenshot](https://github.com/HabaAndrei/Portal_finance_react/blob/main/pozeProiect_finance/finance_home.png)

- **Explore Page**
  ![Explore Page Screenshot](https://github.com/HabaAndrei/Portal_finance_react/blob/main/pozeProiect_finance/finance_explore.png)

- **Chat Page**
  ![Chat Page Screenshot](https://github.com/HabaAndrei/Portal_finance_react/blob/main/pozeProiect_finance/finance_chat.png)

- **News Page**
  ![News Page Screenshot](https://github.com/HabaAndrei/Portal_finance_react/blob/main/pozeProiect_finance/finance_news.png)
  
- **Stock Page**
  ![Stock Page Screenshot](https://github.com/HabaAndrei/Portal_finance_react/blob/main/pozeProiect_finance/finance_stock.png)
