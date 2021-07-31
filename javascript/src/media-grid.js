
export default function MediaGrid(container, media, max_height) {
    var space_between_media = 4;

    let media_objects = media.map(item => new MediaObject(item));
    media_objects.forEach(element => _add_object_to_container(element));

    window.onresize= () => _calc_rows();

    let timer = window.setInterval(() => {
        if(container.clientWidth>0){
            _calc_rows()
            _kill_timer()
        }
    },100)

    function _kill_timer(){
        window.clearInterval(timer)
    }

    function _calc_rows() {
        let min_aspect = _get_min_aspect_ratio()
    
        let rows = []
        let current_aspect_ratio = 0
        let current_row = []
        for(let object of media_objects){
            current_aspect_ratio += object.aspect_ratio
            current_row.push(object)
            if (current_aspect_ratio > min_aspect){ // this row is full we can cap it
                let row_item  = {}
                row_item.items = current_row
                row_item.aspect_ratio = current_aspect_ratio
                rows.push(row_item)
                // resetting the temp loop vars 
                current_aspect_ratio = 0 
                current_row = []
            } 
        }
        // check if theres photos left that dont make a whole row

        if(current_aspect_ratio > 0) {
            let row_item  = {}
            row_item.items = current_row
            row_item.aspect_ratio = min_aspect
            rows.push(row_item)
        }

        _populate_container(rows)  
    }


    function _populate_container(rows) {
        let x = 0
        let y = 0 
        for (let row of rows){
            let image_width = container.clientWidth - space_between_media * (row.items.length - 1);
            let row_height = image_width / row.aspect_ratio;
            for (let object of row.items) {
                object._update_position(x,y,row_height);
                x = x+ object.aspect_ratio*row_height + space_between_media
            }
            x = 0 
            y = y + row_height + space_between_media
        }

        container.style = `height:${y}px`
        
    }

    function _add_object_to_container(object) {
        container.appendChild(object.dom_object)

    }

    // dynamically calculates the min aspect ration needed to fill the screen based on the desired max_height for images
    function _get_min_aspect_ratio() {
        let width = container.clientWidth;
        return width/max_height;
    }
   
}

class MediaObject{
    constructor(item){
        this.base_url = item.base_url
        this.type = item.type
        this.aspect_ratio = item.aspect_ratio

        this.dom_object = document.createElement('div')
        this.dom_object.classList.add('media-object')
        this.dom_object.style = `width:${this.aspect_ratio*20}px;height:${20}px`
        this._fill_object()
    }

    _fill_object() {
        // this.content = new Image();
        // this.content.src = this._get_src_url(20)


        if (this.type == 'image') {
            let full_content = new Image();
            full_content.src = this._get_src_url();
            this.content = full_content
            full_content.onload = this._replace_content;

        }else if (this.type == 'video') {
            let full_content = document.createElement('video')
            full_content.src = this._get_src_url();
            full_content.autoplay = true
            full_content.loop = true
            full_content.playsinline = true
            full_content.muted = true
            full_content.poster = this._get_src_url(null, true);
            this.content = full_content
            full_content.onloadeddata = this._replace_content;
            full_content.onerror = (e) => e.target.load()
        }

        this.content.classList.add('blur')
        this.dom_object.appendChild(this.content)
    }



    _replace_content() {
        this.classList.remove('blur')
    }


    _update_position(x,y,height) {
        

        this.dom_object.style = `width:${parseInt(this.aspect_ratio*height)}px;height:${parseInt(height)}px;transform:translate(${parseInt(x)}px,${parseInt(y)}px)`
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





