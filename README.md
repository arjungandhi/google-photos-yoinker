[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Website][website-shield]][website-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">Google Photos Yoinker</h3>

  <p align="center">
    a auto-updating carousel for your website
    <br />
    <br />
    <a href="https://www.arjungandhi.com/projects/internets/google-photos-hurts-me/">View Demo</a>
    ·
    <a href="https://github.com/arjungandhi/google-photos-yoinker/issues">Report Bug</a>
    ·
    <a href="https://github.com/arjungandhi/google-photos-yoinker/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#todo">TODO</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Google had no good way to embed google photos albums so I did it my self. To use this library you're gonna need to set up a proxy function to funnel the requests through I'll briefly cover the way I did it and include links to AWS's documentation. But as long as the proxy function passed into the script returns the right data it'll work. 

### Features
- blur until load
- dynamic resizing
- load videos and photos
- auto updates pictures and videos using the just the album id
- grid and carousel display options
- minimal css for easy editing

### Built With
* [Swiper](https://swiperjs.com/)
* [AWS](https://aws.amazon.com)

<!-- GETTING STARTED -->
## Getting Started

To use swiper on your own site you'll need to set up an api/lambda/proxy thing to make the google requests with. Google Photos has Same-Origin headers so we can't just make the requests directly from the browser. There's a hundred different ways to do this but I'll go through doing it the way I did which is with AWS and API gateway. 

### Prerequisites

* AWS
    Gotta have one

### How to Setup the AWS Proxy
1. Create a new lambda function with python 3.8: 
    - Instructions: https://docs.aws.amazon.com/lambda/latest/dg/getting-started-create-function.html
2. Copy and paste/somehow upload [this](https://github.com/arjungandhi/google-photos-yoinker/blob/master/lambda_function/lambda_function.py) code into your created function (you can straight up do this through their editor)
3. Setup a REST API through API gateway create a GET Method either under a resource or under the root. 
    - Instructions: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-step-by-step.html (Follow this but choose Lambda function instead of HTTP when choosing the Integration type)
4. Setup a query string for the url and feed that into the lambda function. (The instructions are in the guide above)
5. Enable CORS 
    - Instructions: https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors-console.html
    - I would limit the cors to your domain, but for development you can leave it as is. 
6. Deploy the API
    - Instructions: https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-deploy-api-with-console.html
7. Copy the Invoke Url we will need that later (depending how you set it up you may need to add the resource name after your invoke url)
    - For example mine is ```{invokeurl}/proxy```

### Using the Library
1. Add the CSS to your head tag. 
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/google-photos-yoinker@1.1.6/src/yoink.min.css">
```

3. copy the following code into your body
```html
<div id="photos-container"></div>
<script type="module">
    import embed_google_photos from "https://cdn.jsdelivr.net/npm/google-photos-yoinker@1.1.0/src/yoink.min.js"

    async function make_request(url){
        const proxy_url = '{{$invoke_url}}?url='

        var response = await fetch(`${proxy_url}${encodeURIComponent(url)}`)

        return response 
    }

    embed_google_photos("{{$your google photos id}}", "photos-container", "{{$type}}", make_request, 240)  //this last paramater is optional and is just the max-height when using grid layout  
</script>
```

- {{$type}}: is either 'grid' or 'carousel': see a demo [here](https://www.arjungandhi.com/projects/internets/google-photos-hurts-me/)
- {{$your google photos id}} is the public id of your google photos album (its the last part of the sharable url)
- {{$invoke_url}}: is your invoke url

4. Run the page and you should see your album pop up :) 

### Other Useful Info

If you wanna do the proxy some other way go for it you as long as its an async function and returns the data as a json formatted as following

```json
{
  "body": {
    "data": "the request data, <- the request data format (in this case its an html string)",
    "redirected": "Bool <- a boolean value based on whether the request was redirected (important for telling between pictures and videos)"
  }
}
```
## TODO

- [ ] make the it so setting up the AWS function is a single command using like a bash function/ cloud formation script or figure out a better way to do proxies so you just need to use the library and no aws at all. 
- [ ] comment my code better



## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact
Arjun Gandhi - [@arjungandhi06](https://twitter.com/arjungandhi06) - contact@arjungandhi.com

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/arjungandhi06/
[website-shield]:https://img.shields.io/website-up-down-green-red/http/shields.io.svg?style=for-the-badge
[website-url]:https://www.arjungandhi.com
