
import MediaGrid from './media-grid.js'
import MediaCarousel from './media-carousel.js'



export default async function embed_google_media(sharable_id, id ,  type='grid' , proxy_function = _make_request , height = 240, ){
 
    const album_url = `https://photos.app.goo.gl/${sharable_id.trim()}`

    
    let json =await proxy_function(album_url)

    var html = json.body.data

    let container = document.getElementById(id)
    var re = /src="(.{0,1000})=w/g;
    
    var urls = Array.from(html.matchAll(re)).map(match => match[1]) //find all links in the html that matter get the group we found
    var media = await Promise.all(urls.map(url => _url_to_media_item(url,proxy_function))) // make array by mapping urls using the url to media item function
    
    if (type=='grid'){
        return _elements_to_grid(media, container, height)
    } else if (type=='carousel') {
        return _element_to_carousel(media, container)
    }
}   

async function  _url_to_media_item(url,proxy_function){
    let media_item = {}
    media_item.base_url = url
    
    // try seeing if this media item is a video 
    let json = await proxy_function(`${url}=dv`) 
    
    if (json.body.redirected){ // if this is a success then the object is a video / moving picture if it fails then it is not
        media_item.type = 'video'
    } else { //media is a image
        media_item.type = 'image'
    }
    media_item.aspect_ratio = await _get_aspect_ratio(`${url}=w20-h20`)
    return media_item
}

function _get_aspect_ratio(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img.naturalWidth/img.naturalHeight);
        img.onerror = () => reject();
        img.src = url;

    });
}

function _elements_to_grid(media, container, max_row_height){
    container.classList.add('photo-grid') 
    MediaGrid(container,media,max_row_height)
}

function _element_to_carousel(media,container) {
    container.classList.add('photo-carousel')
    MediaCarousel(container,media)
}


async function _make_request(url){
    var response = await fetch(`${proxy_url}${encodeURIComponent(url)}`) // get request the album page
        
    var json = await response.json() // get html  

    return json 
}
