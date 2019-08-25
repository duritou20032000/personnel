
export function mouseDown(event,id,_this){

    event.stopPropagation();

    var   target = event.target,
        parTarget = target.parentElement,
        disX = event.pageX - target.offsetLeft,
        disY = event.pageY - target.offsetTop,
        w = target.offsetWidth,
        h = target.offsetHeight,
        parW = parTarget.offsetWidth,
        parH = parTarget.offsetHeight,
        padding = 10;


    document.onmousemove = function(event){
        event.preventDefault();
        event.stopPropagation();
        var l = event.pageX - disX,
            t = event.pageY - disY;
        if(l<padding){
            l = padding;
        }
        if(l>parW - w - padding){
            l = parW - w -padding;
        }

        if(t<padding){
            t = padding;
        }
        if(t>parH - h - padding){
            t = parH - h -padding;
        }

        target.style.left = l + "px";
        target.style.top = t + "px";

    }.bind(this);
    document.onmouseup = function(){
        document.onmousemove = null;
        document.onmouseup = null;

        //获取obj的left和top,设置到对应的水印的left和top
        var left = target.offsetLeft,top = target.offsetTop;
        var wmScale = window.localStorage.getItem("watermarkScale");
        var wmHLocal = 0;
        if(id=="defined" || id=="date"){
            wmHLocal = parseFloat(window.localStorage.getItem("watermark_"+id));         //高度矫正
        }

        let defaults = _this.state.defaults;
        defaults['left_'+id] = left/wmScale;
        defaults['top_'+id] = parseFloat(top/wmScale) + wmHLocal;

        _this.setState({
            defaults: defaults,
            random:Math.random(),
        });
    }
}

//初始化拖动块的参数
export function initDragRect(_this) {
    var control = document.getElementById("control");
    var width = control.offsetWidth,height = control.offsetHeight;
    var wmScale = window.localStorage.getItem("watermarkScale");
    //设置二维码拖动块
    var imgW=50,imgH=50,imgLeft=0,imgTop=0,imgSize = _this.state.defaults.imgSize;

    var scale = imgW/imgH;
    imgW = imgSize * wmScale;
    imgH = imgW/scale ;

    if(_this.state.defaults.left_image){
        imgLeft = _this.state.defaults.left_image * wmScale;
    }else if(imgLeft==0){
        imgLeft = width - imgW - 10;
    }

    if(_this.state.defaults.top_image){
        imgTop = _this.state.defaults.top_image * wmScale;
    }else if(imgTop==0){
        imgTop =  height - imgH - 10;
    }

    let controls = _this.state.controls;
    controls['left_image'] = imgLeft;
    controls['top_image'] = imgTop;
    controls['size_image'] = imgW;
    _this.setState({
        controls: controls,
        random:Math.random(),
    });

    //设置日期拖动块
    var dateW=0,dateH=0,dateLeft=0,dateTop=0,dateText="",dateSize=13;
    if(_this.state.defaults.text_date){
        //获取日期字符串
        dateText = _this.state.defaults.text_date;
        dateSize = _this.state.defaults.textSize_date;

        dateW = dateText.length * dateSize * wmScale;
        dateH = dateSize * wmScale;
        window.localStorage.setItem("watermark_date",dateH);

        if(_this.state.defaults.left_date){
            dateLeft = _this.state.defaults.left_date * wmScale;
        }else if(dateLeft==0){
            dateLeft = (width + dateW)/8;
        }

        if(_this.state.defaults.top_date){
            dateTop = _this.state.defaults.top_date * wmScale - dateH;
        }else if(dateTop==0){
            dateTop =  height*9/10 - dateH;
        }

        let controls = _this.state.controls;
        controls['left_date'] = dateLeft;
        controls['top_date'] = dateTop;
        controls['size_date'] = dateH;
        _this.setState({
            controls: controls,
            random:Math.random(),
        });

    }else{

        let controls = _this.state.controls;
        controls['left_date'] = 0;
        controls['top_date'] = 0;
        _this.setState({
            controls: controls,
            random:Math.random(),
        });
    }


    //设置自定义文字拖动块
    var definedW=0,definedH=0,definedLeft=0,definedTop=0,definedText="",definedSize=13;
    if(_this.state.defaults.text_defined){
        //获取日期字符串
        definedText = _this.state.defaults.text_defined;
        definedSize = _this.state.defaults.textSize_defined;

        definedW = definedText.length * definedSize * wmScale;
        definedH = definedSize * wmScale;
        window.localStorage.setItem("watermark_defined",definedH);

        if(_this.state.defaults.left_defined){
            definedLeft = _this.state.defaults.left_defined * wmScale ;
        }else if(definedTop==0){
            definedLeft = width/2  ;
        }

        if(_this.state.defaults.top_defined){
            definedTop = _this.state.defaults.top_defined * wmScale - definedH ;
        }else if(definedTop==0){
            definedTop =  (height)/2 - definedH;
        }

        let controls = _this.state.controls;
        controls['left_defined'] = definedLeft;
        controls['top_defined'] = definedTop;
        controls['size_defined'] = definedH;
        _this.setState({
            controls: controls,
            random:Math.random(),
        });

    }else{

        let controls = _this.state.controls;
        controls['left_defined'] = 0;
        controls['top_defined'] = 0;
        _this.setState({
            controls: controls,
            random:Math.random(),
        });
    }

}