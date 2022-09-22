<script>
  let isOrder = true;
</script>

<header>
  <div id="mainHead">
    <a href="https://customfamilytreeart.com">
      <img alt="Logo" src="/imgs/Homestead Images/2020 Logo Web.png" id="logo" />
    </a>
    <div id="headText">Turn Your Family History Into Art!</div>
    <a href="https://customfamilytreeart.com/gift-certificates">
      <img
        alt="Gift"
        src="/imgs/Homestead Images/Gift Certificates Available for Custom Family Tree Art.jpg"
        id="gift"
      />
    </a>
  </div>
  <nav>
    <ul>
      <li><a href="https://customfamilytreeart.com/">HOME</a></li>
      <li class="hidden-items">
        <a href="https://customfamilytreeart.com/order" class:active={isOrder}
          >ORDER<i class="material-icons drop">expand_more</i></a
        >
        <div class="items">
          <a href="https://shop.customfamilytreeart.com">Order a Tree</a><a
            href="https://customfamilytreeart.com/updates">Update a Tree</a
          ><a href="https://customfamilytreeart.com/gift-certificates">Gift Certificates</a>
        </div>
      </li>
      <li><a href="https://customfamilytreeart.com/faq">FAQ</a></li>
      <li class="hidden-items">
        <a href="https://customfamilytreeart.com/trees"
          >TREES<i class="material-icons drop">expand_more</i></a
        >
        <div class="items">
          <a href="https://customfamilytreeart.com/ancestry-trees">Ancestry Trees</a><a
            href="https://customfamilytreeart.com/descendant-trees">Descendant Trees</a
          ><a href="https://customfamilytreeart.com/additional-designs">Additional Designs</a><a
            href="https://customfamilytreeart.com/updates">Updates</a
          ><a href="https://customfamilytreeart.com/gallery">Gallery</a>
        </div>
      </li>
      <li class="hidden-items">
        <a href="https://customfamilytreeart.com/info"
          >INFO<i class="material-icons drop">expand_more</i></a
        >
        <div class="items">
          <a href="https://customfamilytreeart.com/how-it-works">How It Works</a><a
            href="https://customfamilytreeart.com/name-forms">Name Forms</a
          ><a href="https://customfamilytreeart.com/prints">Prints</a><a
            href="https://customfamilytreeart.com/frames">Frames</a
          ><a href="https://customfamilytreeart.com/prices">Prices</a><a
            href="https://customfamilytreeart.com/shipping">Shipping</a
          >
        </div>
      </li>
      <li><a href="https://customfamilytreeart.com/contact">CONTACT</a></li>
    </ul>
  </nav>
  <div id="banner">
    <div id="bannerText">
      <div>#1 Design your tree the way you want it.</div>
      <div>#2 Submit your order.</div>
      <div>#3 Submit your names.</div>
      <div>#4 Approve the final design before printing.</div>
    </div>
  </div>
</header>

<style>
  #mainHead {
    /*min-height: 217px;*/
    position: relative;
    display: flex;
    margin-bottom: -40px;
    z-index: 1;
  }

  #mainHead * {
    display: inline-block;
  }

  #logo {
    width: 264px;
    height: 157px;
    position: relative;
    left: 5px;
  }

  #gift {
    width: 124px;
    height: 89px;
    position: relative;
    top: 36px;
    right: 26px;
    box-shadow: 3px 3px 7px 4px #e5e5e5;
  }

  #headText {
    font-family: 'Bad Script', cursive;
    color: #603913;
    position: relative;
    right: 18px;
    top: 13px;
    display: flex;
    font-size: 26px;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    text-shadow: 3px 3px 7px #cbb19c;
  }

  nav {
    position: relative;
    font-family: Ubuntu, sans-serif;
    flex-basis: 100%;
    width: 100%;
    text-align: right;
    margin-bottom: 38px;
    z-index: 10;
  }

  nav ul {
    list-style: none;
    display: flex;
    justify-content: flex-end;
  }

  nav li {
    display: inline-block;
  }

  nav li > a:hover {
    background-color: #dcdcdb;
  }

  nav a {
    text-decoration: none;
    color: #000;
  }

  nav li > a {
    display: flex;
    text-decoration: none;
    justify-content: center;
    align-items: center;
    color: rgb(96, 57, 19);
    padding: 0px 10px;
    margin: 0 9px;
    width: 82px;
    height: 38px;
    line-height: 1.2;
    letter-spacing: 0px;
    font-size: 18px;
    font-weight: bold;
  }

  #banner {
    background-color: #77a34f;
    min-height: 38px;
    width: 100%;
    font-family: Ubuntu, sans-serif;
    font-size: 14px;
    color: #fff;
    position: absolute;
    left: 0;
    top: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #banner div {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #77a34f;
  }

  img {
    vertical-align: middle;
  }

  .gallery .table-row div img {
    width: 100%;
    border-radius: 3px;
    box-shadow: 5px 5px 5px #555;
  }

  .drop {
    vertical-align: middle;
  }

  .hidden-items > .items {
    position: absolute;
    background-color: #fff;
    color: rgb(96, 57, 19);
    font-size: 15px;
    font-weight: 500;
    width: 168px;
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: -25px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s;
  }

  .hidden-items:hover > .items {
    max-height: 300px;
  }

  .items > a:hover {
    background-color: #f0f0f0;
  }

  .items > a {
    padding: 9.5px 20px;
  }

  .active {
    background-color: #f4f4f4;
  }
</style>
