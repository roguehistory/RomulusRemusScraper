const Scraper = require('@yimura/scraper').default;
const csvdata = require('csvdata')
const puppeteer = require('puppeteer-core');
const ytcm = require("@freetube/yt-comment-scraper")
const fs = require('fs')
const {
  getSubtitles
} = require('youtube-captions-scraper-x');
const ytch = require('yt-channel-info');
const {
  getChannelCommunityPosts
} = require('yt-channel-info');
const cheerio = require('cheerio');


const SCREEN_SHOT_DELAY = 60; // sets the delay for taking screenshot. Adjust to account for ads on youtube videos.
/// further dev could trigger the "skip ads" button, and reduce delay to 10s.

let DATA = []
let START = 0;
let END = 10;

async function processCSV() {
  let list = await getCsvList();
  for (i = START; i < END; i++) {
    try {
      let item = await searchVideo(list[i].id)
      // console.log("IS THIS BROKEN ---> ",item)
      if (item?.id) {
        try {
          item.scrapedDate = new Date();
          item.captions = await getSubtitles({
            videoID: item.id,
            lang: 'en'
          })
        } catch (e) {
          // console.log(e);
        }
        console.log(i + ": " + item.title)
        DATA.push(item)
      } else {
        console.log("error")
      }
    }
    catch(e){
      console.log("something was wrong with that data string...")
    }
  }
  Promise.all(DATA).then(async function (res) {
    await getComments(DATA);
    //// get likes ///
    await getUserData(DATA)
    // await getChannelCommunityPostss(DATA)
    saveDATA(DATA)
  })
}


async function getChannelCommunityPostss(list) {
  console.log("Community Post - Looking for Chanel: ", list)
  ytch.getChannelCommunityPosts({
    channelId: 'UCXuqSBlHAE6Xw-yeJA0Tunw'
  }).then((response) => {
    // console.log(response)
  }).catch((err) => {
    console.log(err)
  })
  return
}

async function getComments(list) {
  try{
    let payload;
    let comments;
    // console.log(list)
    for (i = START; i < END; i++) {
      try{
        payload = {
          videoId: list[i].id,
          sortByNewest: true
        }
        console.log(i + ": Get Comments for [" + i + "]: " + list[i].id)
        comments = await ytcm.getComments(payload)
        // console.log(comments)
        list[i] = {
          ...comments,
          ...list[i]
        };
      }
      catch(e){
        console.log("error getting comments for this record..")
      }
    }
  }
  catch(e){
    e
  }
}




async function getUserData(list) {
  try{
    const launchOptions = {
      // other options (headless, args, etc)
      executablePath: '/home/alphanerd/Dev/chromium-latest-linux/latest/chrome',
      headless: false
    }
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
  
    for (i = 0; i < list.length; i++) {
      console.log(i + "| Go to: " + list[i].link)
      await page.goto(list[i].link)
  
      ///// GRAB DATA ////////////////////////////////////////
      /////// ROOT LEVEL - Go to Publisher Profile
      try {
        await page.waitForSelector(`[href^="/user/"]`, {
          timeout: 3000
        })
        await page.click(`[href^="/user/"]`);
        await page.waitForSelector(`tp-yt-paper-tab`, {
          timeout: 3000
        })
  
  
  
  
        let url = await page.evaluate(() => document.location.href);
        console.log(url);
        await page.goto(url + "/about")
        await page.waitForSelector(`#description-container`, {
          timeout: 3000
        })
        let element = await page.$('#description-container')
        let description = await page.evaluate(el => el.textContent, element)
        console.log(description.trim())
  
        let element2 = await page.$('div[id="right-column"]')
        let metadata = await page.evaluate(el => el.textContent, element2)
        console.log(metadata.trim())
  
        list[i].publisher = {
          description: description,
          stats: metadata
        }
  
        // ***************** IMPORTANT *************************************************************************************
        ///// need to find out why Puppeteer is not returning multiple elements of a class, and only return first elelemnt.
        // ***********************************************************************************************************************
  
  
  
        /////// use cheerio to grab list of videos by the publisher of original video ID
        // url = await page.evaluate(() => document.location.href);
        // console.log(url);
        // await page.goto(url+"/videos")
        // const pageData = await page.evaluate(() => {
        //   return {
        //       html: document.documentElement.innerHTML,
        //   };
        // });
        // const $ = await cheerio.load(pageData.html);
        // let videos = await $('a#video-title');
        // console.log(videos)
        // videos.each((index, element) => {
        //   console.log(element)
        // });
  
  
  
  
  
  
        // element = await page.$('div[class*="ytd-grid-video"]')
        // console.log(element)
        // let videos = await page.evaluate(el => el.textContent, element)
        // console.log(videos)
  
        // element2 = await page.$('div[id="right-column"]')
        // let metadata = await page.evaluate(el => el.textContent, element2)
        // console.log(metadata.trim())
  
  
  
  
  
        await page.screenshot({
          path: './report/src/app/assets/screenshots/' + list[i].id + '.png'
        });
  
  
  
  
      } catch (e) {
        // console.log(e);
        console.log(e)
      }
  
      ////////////////////////////////////////
  
      // await page.screenshot({
      //   path: 'IMAGES/' + list[i].id + '.png'
      // });
    }
    await browser.close();
    return list
  }
  catch(e){
    console.log(e)
  }
}


async function searchVideo(obj) {
  try{
    const youtube = new Scraper();
    return youtube.search(obj).then(results => {
      return results.videos[0]
    });
  }
  catch(e){
    console.log(e)
  }
}




async function getCsvList() {
  let data = await csvdata.load("./sourceIDs.csv", {
    delimiter: ',',
    // encoding: 'utf8',
    log: false,
    objName: undefined,
    parse: true,
    stream: false
  });
  return data;
}




async function saveDATA(data) {
  try {
    fs.writeFileSync("./DATA.json", JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
  // csvdata.write("./OUTPUT.csv", data, {
  //   append: false,
  //   delimiter: ',',
  //   empty: false,
  //   encoding: 'utf8',
  //   header: 'id,description,duration,uploaded,views,link,thumbnail,title,shareLink,comments',
  //   log: false
  // })
  // // csvdata.write("./DATA.csv", data, [options])
}



module.exports.processCSV = processCSV;
module.exports.searchVideo = searchVideo;
module.exports.getCsvList = getCsvList;
module.exports.saveDATA = saveDATA;
