
import MediaGrid from './media-grid.js'
import MediaCarousel from './media-carousel.js'
const proxy_url = 'https://api.arjungandhi.com/proxy?url='

export default async function embed_google_media(sharable_id, height = 240, type='grid'){
 
    const album_url = `https://photos.app.goo.gl/${sharable_id.trim()}`

    var response = await fetch(`${proxy_url}${encodeURIComponent(album_url)}`) // get request the album page

    var json = await response.json() // get html  
    var html = json.body

    var re = /src="(.{0,1000})=w/g;
    
    var urls = Array.from(html.matchAll(re)).map(match => match[1]) //find all links in the html that matter get the group we found
    var media = await Promise.all(urls.map(url => _url_to_media_item(url))) // make array by mapping urls using the url to media item function

    if (type='grid'){
        return _elements_to_grid(media,height)
    } else if (type='carousel') {
        var elements =  await Promise.all(media.map(item => _media_item_to_html(item,height)))
    }
}   

async function  _url_to_media_item(url){
    let media_item = {}
    media_item.base_url = url
    
    // try seeing if this media item is a video 
    let response = await fetch(`${url}=dv`, {
        method: 'HEAD'
    } )
    if (response.redirected){ // if this is a success then the object is a video / moving picture if it fails then it is not
        media_item.src_url = `${url}=dv`
        media_item.type = 'video'
        media_item.poster_url = `${url}=d`
    } else { //media is a image
        media_item.src_url = `${url}=d`
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

function _elements_to_grid(media, max_row_height){
    let container = document.createElement('div')
    container.classList.add('photo-grid') 
    MediaGrid(container,media,max_row_height)
    return container
}

function _element_to_carousel(media) {
    
}