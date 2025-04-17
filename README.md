<p align="center">
  <img src="images/AppIcon.jpg" alt="App Icon" width="120">
</p>

<h1 align="center">BKExpress</h1>

<p align="center">
  <img src="images/AboutApp.jpg" alt="Feature Graphic" width="80%">
</p>

## ✨ Features
Update the latest news quickly!!

Our app helps users stay informed with the newest headlines in real time. With a clean interface and seamless navigation, you can easily explore categories, read breaking news, and stay up-to-date anytime, anywhere.


✨ **In our first release**, we provide paper viewing and search functionality.
We're excited to announce that more features are coming in our next updates!
### Viewing papers according to Category
<p align="center">
  <img src="images/Category.jpg" alt="Feature Graphic" width="30%">
  <img src="images/DetailUp.jpg" alt="Feature Graphic" width="30%">
</p>

### Searching
<p align="center">
  <img src="images/Searching.jpg" alt="Feature Graphic" width="30%">
</p>

# 📥 Download My App
<p align="center">
  <a href="https://drive.google.com/file/d/1_fgHQY7TM_mVVD8G-0O4AE5M-6tb_Kti/view?usp=sharing">
    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" height="60" alt="Get it on Google Play">
  </a>
</p>

#  System Design & Implementation:
<p align="center">
  <img src="images/BKexpresssystemdesign.jpg" alt="Feature Graphic" width="100%">
</p>

### We applied Microservices architecture and deployed with Docker.

- [x] Main server: Responsible for handling business logic, APIs, and database interaction.
- [x] Database: MongoDB Manages Data, structure data, Redis manages cache.
- [x] Crawler: Crawler is used for collecting news data from online sources .
- [x] Service-to-Service Communication : Kafka is used for asynchronous event streaming. 
# Getting started
### For server 
**This is just the guideline for local server only!!!**

```bash
git clone https://github.com/Geawn/BKExpress.git
```
For first time
```bash
cd BE
docker-compose up --build
```
For later run
```bash
cd BE
docker-compose up 
```

fill for backend url in app with the url that backend provide.




