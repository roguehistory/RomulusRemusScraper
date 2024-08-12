# RomulusRemusScraper# README

## YouTube Scrape V1.0 Beta

[https://rr-scrape.herokuapp.com/](https://rr-scrape.herokuapp.com/)

Utilizes two main tools to complete the task. There is an independent NodeJS script that runs in terminal against a CSV list of provided YouTube video IDs.

After scraping the data from the supplied CSV, the front-end tool is deployed to view the data. These will eventually be integrated together, and users will be able to upload new files for processing directly from within the app.

There are several dependencies within NodeJS that must be installed in order to utilize the tool locally on your computer. To navigate the issue, the app has been deployed to a free Heroku instance, where it can be accessed by anyone using this [link](https://rr-scrape.herokuapp.com).

![Diagram](../../../assets/images/diagram.png)

## Dev Stack

- **Ionic Framework - UI**
  - Local or Heroku

- **NodeJS - Data Scraper**
  - Local only. In development to integrate with the front-end, making the scraper accessible from Heroku as well.

## Source Control

The course files for this project are held within a private GitHub repo and can be shared or forked by a contributor who is granted access. The files can also be moved at any time to another repo that is controlled by the client.

[https://github.com/AlphaNerd2021?tab=repositories](https://github.com/AlphaNerd2021?tab=repositories)

To update and push code to GitHub:

```bash
git add .
git commit -m "[some comments here]"
git push
