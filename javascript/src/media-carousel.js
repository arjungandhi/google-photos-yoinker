import Swiper from 'https://unpkg.com/swiper@6.8.1/swiper-bundle.esm.browser.min.js'


export default function MediaCarousel(container, media) {
    let c = document.createElement('div')
    c.classList.add('swiper-container')

    container.appendChild(c)

    let w = document.createElement('div')
    w.classList.add('swiper-wrapper')
    let pagination = document.createElement('div')
    pagination.classList.add('swiper-pagination')
    let prev_button = document.createElement('div')
    prev_button.classList.add('swiper-button-prev')
    let next_button = document.createElement('div')
    next_button.classList.add('swiper-button-next')

    c.appendChild(w)
    c.appendChild(pagination)
    c.appendChild(prev_button)
    c.appendChild(next_button)

    let media_objects = media.map(item => new MediaObject(item));
    media_objects.forEach(element => _add_object_to_wrapper(element));
    let aspect_ratios = media_objects.map(item => item.aspect_ratio)
    let max_aspect_ratio =  Math.max(...aspect_ratios)

    c.style = `width:100%;aspect-ratio:${max_aspect_ratio};--aspect-ratio:${max_aspect_ratio}`

    const swiper = new Swiper('.swiper-container', {
        // If we need pagination
        loop: true,
        centeredSlides:true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets:true,
          },
      });

    function _add_object_to_wrapper(object) {
        w.appendChild(object.dom_object)
    }

    var observer = new IntersectionObserver(function(entries) {
        if(entries[0].isIntersecting === true)
            swiper.update()
    }, { threshold: [1] });

    observer.observe(c);

}

class MediaObject{
    constructor(item){
        this.base_url = item.base_url
        this.type = item.type
        this.aspect_ratio = item.aspect_ratio

        this.dom_object = document.createElement('div')
        this.dom_object.classList.add('swiper-slide')
        this._fill_object()
    }

    _fill_object() {
        if (this.type == 'image') {
            let full_content = new Image();
            full_content.src = this._get_src_url();
            this.content = full_content
            full_content.onload = this._replace_content;

        }else if (this.type == 'video') {
            let full_content = document.createElement('video')
            full_content.src = this._get_src_url();
            full_content.controls = true
            full_content.muted = true
            full_content.poster = this._get_src_url(null, true);
            this.content = full_content
            full_content.onloadeddata = this._replace_content;
            full_content.onerror = (e) => e.target.load()
        }

        setTimeout(function(){ this.content.classList.remove('blur') }, 3000);

        this.content.classList.add('blur')
        this.dom_object.appendChild(this.content)
    }



    _replace_content() {
        this.classList.remove('blur')
    }

    _get_src_url(size=null,poster=false){
        let url = this.base_url + '='
        if(poster){
            url = url + 'd-no'
        } else if (size == null) { // get the full size thing
            url = url +'d'
            if (this.type == 'video') {
                url = url+'v'
            }
        } else {
            url = `${url}w${size}-h${size}`
            if (this.type == 'video') {
                url = url + '-no'
            }
        }

        return url
    }
}
